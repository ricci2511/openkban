import { boardUpdateSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { invalidateBoard } from '@server/redis/board';
import { authedProcedure } from '@server/routers/auth-router';
import { BOARD_INVALIDATION_ERROR, BOARD_UPDATE_ERROR } from '../errors';

export const updateBoard = authedProcedure
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
    });
