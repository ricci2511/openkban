import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { updateError } from '@server/routers/common-errors';
import { z } from 'zod';

export const updateColumn = authedProcedure
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
            return updateColumn;
        } catch (error) {
            throw internalServerError(updateError('column'), error);
        }
    });
