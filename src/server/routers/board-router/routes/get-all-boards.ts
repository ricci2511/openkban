import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { getAllSavedBoards, saveBoards } from '@server/redis/board';
import { saveBoardIdOrIds } from '@server/redis/user-board-ids';
import {
    BOARDS_CACHE_ERROR,
    CACHED_BOARDS_FETCH_ERROR,
    MISSING_BOARDS_QUERY_ERROR,
} from '@server/routers/board-router/errors';
import { queryError } from '@server/routers/common-errors';

// prisma include object to get all users associated with a board
export const boardUserInclude = {
    boardUser: {
        select: {
            role: true,
            isFavourite: true,
            userId: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    },
};

// TODO: adapt procedure for useInfiniteQuery
export const getAllBoards = authedRateLimitedProcedure.query(
    async ({ ctx }) => {
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
                            include: {
                                ...boardUserInclude,
                            },
                        });
                        // cache the missing boards
                        // missingBoards.forEach((board) => saveBoard(board));
                        saveBoards(missingBoards);

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
                    boardUser: {
                        some: {
                            userId,
                        },
                    },
                },
                // TODO: will optimize this to only include the relevant board users
                include: {
                    ...boardUserInclude,
                },
            });

            // might look for a better way to handle this, caching is HARD :(
            // cache the boards and then the board IDs for the corresponding users
            try {
                await saveBoards(boards);
                await saveBoardIdOrIds(
                    userId,
                    boards.map((board) => board.id)
                );
            } catch (error) {
                throw internalServerError(BOARDS_CACHE_ERROR, error);
            }

            // boards are returned while the caching is happening in the background
            return boards;
        } catch (error) {
            const message = queryError('board', false);
            throw internalServerError(message, error);
        }
    }
);
