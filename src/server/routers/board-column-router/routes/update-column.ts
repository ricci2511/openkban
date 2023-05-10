import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { updateError } from '@server/routers/common-errors';
import { ClientColumn } from 'types/board-types';
import { z } from 'zod';

export const updateColumn = authedRateLimitedProcedure
    .input(
        z.object({
            id: z.string().cuid(),
            title: z.string().optional(),
            color: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const updateColumn = await ctx.prisma.boardColumn.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    color: input.color,
                },
            });
            return updateColumn as ClientColumn;
        } catch (error) {
            throw internalServerError(updateError('column'), error);
        }
    });
