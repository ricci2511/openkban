import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { queryError } from '@server/routers/common-errors';

// prisma include object to get all users associated with a board
export const boardUserInclude = {
    boardUser: {
        select: {
            role: true,
            isFavourite: true,
            user: {
                select: {
                    id: true,
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

        try {
            const boards = await ctx.prisma.board.findMany({
                where: {
                    boardUser: {
                        some: {
                            userId,
                        },
                    },
                },
                include: {
                    boardUser: {
                        select: {
                            id: true,
                            role: true,
                            isFavourite: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });

            // boards are returned while the caching is happening in the background
            return boards;
        } catch (error) {
            const message = queryError('board', false);
            throw internalServerError(message, error);
        }
    }
);
