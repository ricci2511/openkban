import { boardUpdateSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { invalidateSavedBoard, updateSavedBoard } from '@server/redis/board';
import { BOARD_CACHE_UPDATE_ERROR, BOARD_INVALIDATION_ERROR } from '../errors';
import { updateError } from '@server/routers/common-errors';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { boardUserInclude } from './get-all-boards';

export const updateBoard = authedRateLimitedProcedure
    .input(boardUpdateSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, title, isFavourite, lastInteractedAt } = input;
        try {
            const board = await ctx.prisma.board.update({
                where: {
                    id,
                },
                data: {
                    title,
                    isFavourite,
                    lastInteractedAt,
                },
                include: { ...boardUserInclude },
            });

            // just update the cached board if the lastInteractedAt field was updated
            // this field is updated each time the user navigates to a board
            if (lastInteractedAt) {
                await updateSavedBoard(id, board).catch((error) => {
                    throw internalServerError(BOARD_CACHE_UPDATE_ERROR, error);
                });
            } else {
                // otherwise just invalidate the board cache
                await invalidateSavedBoard(id).catch((error) => {
                    throw internalServerError(BOARD_INVALIDATION_ERROR, error);
                });
            }

            return board;
        } catch (error) {
            throw internalServerError(updateError('board'), error);
        }
    });
