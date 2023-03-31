import { t } from '@server/trpc';
import { z } from 'zod';
import { authedProcedure } from '../auth-router';
import {
    boardCeationSchema,
    boardUpdateSchema,
} from '@lib/schemas/board-schemas';
import { randomNoRepeats } from '@lib/helpers';
import { PRESET_COLORS } from '@lib/constants';
import {
    saveBoard,
    getAllSavedBoards,
    invalidateBoard,
    deleteBoard,
    getSavedBoardById,
} from '@server/redis/board';
import {
    saveBoardIdOrIds,
    addBoardIdOrIds,
    upsertBoardIds,
} from '@server/redis/user-board-ids';
import { queryColumnsByBoardId } from '../board-column';
import {
    CACHED_BOARDS_FETCH_ERROR,
    MISSING_BOARDS_QUERY_ERROR,
    BOARDS_CACHE_ERROR,
    BOARDS_QUERY_ERROR,
    BOARD_METADATA_CACHE_ERROR,
    BOARD_IDS_CACHE_ERROR,
    BOARD_QUERY_ERROR,
    BOARD_CREATE_ERROR,
    BOARD_UPDATE_ERROR,
    BOARD_INVALIDATION_ERROR,
    BOARD_DELETE_ERROR,
    BOARD_CACHE_DELETE_ERROR,
} from './errors';
import { internalServerError, notFound } from '@server/trpc-error-helpers';
import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import { BoardData } from 'types/board-types';

const sortTasksOfBoard = (board: BoardData): BoardData => {
    return {
        ...board,
        columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.sort(sortByLexoRankAsc),
        })),
    };
};

export const boardRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const cachedBoards = await getAllSavedBoards(userId);
        if (cachedBoards) {
            try {
                const { boards, missingBoardIds } = cachedBoards;

                // if some boards are missing, query them from the db and return them with the cached ones
                if (!!missingBoardIds.length) {
                    try {
                        const missingBoards = await ctx.prisma.board.findMany({
                            where: {
                                id: {
                                    in: missingBoardIds,
                                },
                            },
                        });
                        // cache the missing boards
                        missingBoards.forEach((board) => saveBoard(board));

                        return [...boards, ...missingBoards];
                    } catch (error) {
                        throw internalServerError(
                            MISSING_BOARDS_QUERY_ERROR,
                            error
                        );
                    }
                }

                // if no missing boards and no error, just return the cached boards
                return boards;
            } catch (error) {
                throw internalServerError(CACHED_BOARDS_FETCH_ERROR, error);
            }
        }

        // if not found in cache, query the db
        try {
            const boards = await ctx.prisma.board.findMany({
                where: {
                    userId,
                },
            });

            // first cache the boards and then cache the board IDs for the user
            Promise.all(
                boards.map((board) => {
                    saveBoard(board);
                    return board.id;
                })
            )
                .then((boardIds) =>
                    boardIds.length ? saveBoardIdOrIds(userId, boardIds) : null
                )
                .catch((error) => {
                    throw internalServerError(BOARDS_CACHE_ERROR, error);
                });

            // boards are returned while the caching is happening in the background
            return boards;
        } catch (error) {
            throw internalServerError(BOARDS_QUERY_ERROR, error);
        }
    }),
    getById: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
            const boardId = input.id;

            const savedBoard = await getSavedBoardById(boardId);
            // if board metadata is cached, only query the columns with tasks
            if (savedBoard) {
                const columnsWithTasks = await queryColumnsByBoardId(
                    ctx.prisma,
                    boardId
                );

                return sortTasksOfBoard({
                    ...savedBoard,
                    columns: columnsWithTasks,
                });
            }

            try {
                const board = await ctx.prisma.board.findUnique({
                    where: {
                        id: input.id,
                    },
                    include: {
                        columns: {
                            include: {
                                tasks: true,
                            },
                        },
                    },
                });

                if (!board) throw notFound('Board not found');

                const { columns, ...metadata } = board;

                // cache board metadata
                await saveBoard(metadata).catch((error) => {
                    throw internalServerError(
                        BOARD_METADATA_CACHE_ERROR,
                        error
                    );
                });

                // conditionally cache the board ID for the user
                await upsertBoardIds(ctx.session.user.id, boardId).catch(
                    (error) => {
                        throw internalServerError(BOARD_IDS_CACHE_ERROR, error);
                    }
                );

                return sortTasksOfBoard(board);
            } catch (error) {
                throw internalServerError(BOARD_QUERY_ERROR, error);
            }
        }),
    create: authedProcedure
        .input(boardCeationSchema)
        .mutation(async ({ ctx, input }) => {
            const randomColor = randomNoRepeats(PRESET_COLORS);
            const userId = ctx.session.user.id;
            try {
                const board = await ctx.prisma.board.create({
                    data: {
                        title: input.title,
                        isFavourite: input.isFavourite,
                        userId: ctx.session.user.id,
                        columns: {
                            create: input.columnTitles.map((title) => ({
                                title: title,
                                color: randomColor(),
                            })),
                        },
                    },
                });

                // cache the new board metadata
                await saveBoard(board).catch((error) => {
                    throw internalServerError(
                        BOARD_METADATA_CACHE_ERROR,
                        error
                    );
                });
                // cache the new board ID
                await addBoardIdOrIds(userId, board.id).catch((error) => {
                    throw internalServerError(BOARD_IDS_CACHE_ERROR, error);
                });

                return board;
            } catch (error) {
                throw internalServerError(BOARD_CREATE_ERROR, error);
            }
        }),
    update: authedProcedure
        .input(boardUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, title, isFavourite, lastInteractedAt } = input;
            try {
                const updateBoard = await ctx.prisma.board.update({
                    where: {
                        id,
                    },
                    data: {
                        title,
                        isFavourite,
                        lastInteractedAt,
                    },
                });

                await invalidateBoard(id).catch((error) => {
                    throw internalServerError(BOARD_INVALIDATION_ERROR, error);
                });

                return updateBoard;
            } catch (error) {
                throw internalServerError(BOARD_UPDATE_ERROR, error);
            }
        }),
    delete: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const board = await ctx.prisma.board.delete({
                    where: {
                        id: input.id,
                    },
                });

                await deleteBoard(ctx.session.user.id, board.id).catch(
                    (error) => {
                        throw internalServerError(
                            BOARD_CACHE_DELETE_ERROR,
                            error
                        );
                    }
                );

                return board;
            } catch (error) {
                throw internalServerError(BOARD_DELETE_ERROR, error);
            }
        }),
});
