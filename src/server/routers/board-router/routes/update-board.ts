import { boardUpdateSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { updateError } from '@server/routers/common-errors';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { boardUserInclude } from './get-all-boards';

export const updateBoard = authedRateLimitedProcedure
    .input(boardUpdateSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, title, lastInteractedAt } = input;
        try {
            const board = await ctx.prisma.board.update({
                where: {
                    id,
                },
                data: {
                    title,
                    lastInteractedAt,
                },
                include: { ...boardUserInclude },
            });

            return board;
        } catch (error) {
            throw internalServerError(updateError('board'), error);
        }
    });
