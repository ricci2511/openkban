import { t } from '@server/trpc';
import { z } from 'zod';
import { authedProcedure } from './auth-router';
import {
    boardCeationSchema,
    boardUpdateSchema,
} from '@lib/schemas/board-schemas';
import { randomNoRepeats } from '@lib/helpers';
import { PRESET_COLORS } from '@lib/constants';
import { BoardData } from 'types/board-types';
import {
    cacheBoard,
    getCachedBoards,
    invalidateBoard,
} from '@server/redis/board-om';
import {
    cacheBoardId,
    cacheBoardIds,
    deleteBoardId,
} from '@server/redis/user-om';
import { TRPCError } from '@trpc/server';

export const boardRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const cachedBoards = await getCachedBoards(userId);
        if (cachedBoards) {
            const { boards, missingBoardIds, error } = cachedBoards;

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not fetch boards from redis cache.',
                    cause: error,
                });
            }

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
                    missingBoards.forEach((board) => cacheBoard(board));

                    return [...boards, ...missingBoards];
                } catch (error) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message:
                            'Could not fetch missing boards from the database.',
                        cause: error,
                    });
                }
            }

            // if no missing boards and no error, just return the cached boards
            if (!error) return boards;
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
                    cacheBoard(board);
                    return board.id;
                })
            )
                .then((boardIds) => cacheBoardIds(userId, boardIds))
                .catch((error) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message:
                            'Could not cache boards or user boardIds in redis',
                        cause: error,
                    });
                });

            // boards are returned while the caching is happening in the background
            return boards;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                    'Could not fetch boards from the database. Please try again later.',
                cause: error,
            });
        }
    }),
    getById: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
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
            return board as BoardData | null;
        }),
    create: authedProcedure
        .input(boardCeationSchema)
        .mutation(async ({ ctx, input }) => {
            const randomColor = randomNoRepeats(PRESET_COLORS);
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

                try {
                    // cache the board and then cache the board ID for the user
                    cacheBoard(board).then(() => {
                        cacheBoardId(ctx.session.user.id, board.id).catch(
                            (error) => {
                                throw new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message:
                                        'Could not cache board ID in redis',
                                    cause: error,
                                });
                            }
                        );
                    });
                } catch (error) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Could not cache board in redis',
                        cause: error,
                    });
                }

                return board;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not create board. Please try again later.',
                    cause: error,
                });
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
                invalidateBoard(id).catch((error) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Could not invalidate board cache',
                        cause: error,
                    });
                });
                return updateBoard;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not update board. Please try again later.',
                    cause: error,
                });
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

                try {
                    invalidateBoard(board.id).then(() => {
                        deleteBoardId(ctx.session.user.id, board.id).catch(
                            (error) => {
                                throw new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message:
                                        'Could not delete board ID from redis',
                                    cause: error,
                                });
                            }
                        );
                    });
                } catch (error) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Could not delete board from redis',
                        cause: error,
                    });
                }

                return board;
            } catch (error) {
                console.log('BOARD DELETE ERROR', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not delete board. Please try again later.',
                    cause: error,
                });
            }
        }),
});
