import { PRESET_COLORS } from '@lib/constants';
import { randomNoRepeats } from '@lib/helpers';
import { boardCeationSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { saveBoard } from '@server/redis/board';
import { authedProcedure } from '@server/routers/auth-router';
import { upsertBoardIds } from '@server/redis/user-board-ids';
import { createError } from '@server/routers/common-errors';
import { boardUserInclude } from './get-all-boards';

export const createBoard = authedProcedure
    .input(boardCeationSchema)
    .mutation(async ({ ctx, input }) => {
        const randomColor = randomNoRepeats(PRESET_COLORS);
        const userId = ctx.session.user.id;
        try {
            const board = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    userId: ctx.session.user.id,
                    columns: {
                        create: input.columnTitles.map((title) => ({
                            title: title,
                            color: randomColor(),
                            createdBy: {
                                connect: {
                                    id: userId,
                                },
                            },
                        })),
                    },
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
                },
                include: { ...boardUserInclude },
            });

            // cache the new board metadata
            await saveBoard(board);
            // cache the new board ID
            await upsertBoardIds(userId, board.id);

            return board;
        } catch (error) {
            throw internalServerError(createError('board'), error);
        }
    });
