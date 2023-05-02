import {
    DEFAULT_MEMBER_BOARD_PERMISSIONS,
    PRESET_COLORS,
} from '@lib/constants';
import { randomNoRepeats } from '@lib/helpers';
import { boardCeationSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { createError } from '@server/routers/common-errors';

export const createBoard = authedProcedure
    .input(boardCeationSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const userId = ctx.session.user.id;

            const board = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    userId: ctx.session.user.id,
                    boardUser: {
                        create: {
                            role: 'ADMIN',
                            isFavourite: input.isFavourite,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                        },
                    },
                    memberPermissions: {
                        create: {
                            permissions: {
                                create: DEFAULT_MEMBER_BOARD_PERMISSIONS.map(
                                    (permission) => ({ permission })
                                ),
                            },
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

            const randomColor = randomNoRepeats(PRESET_COLORS);
            // columns need to be created separetely to properly connect the owner
            // createMany doesnt allow connect relations, therefore a loop with create is needed
            for (const title of input.columnTitles) {
                await ctx.prisma.boardColumn.create({
                    data: {
                        title,
                        color: randomColor(),
                        board: {
                            connect: {
                                id: board.id,
                            },
                        },
                        owner: {
                            connect: {
                                id: board.boardUser[0].id,
                            },
                        },
                    },
                });
            }

            return board;
        } catch (error) {
            console.error('ERROR creating board', error);
            throw internalServerError(createError('board'), error);
        }
    });
