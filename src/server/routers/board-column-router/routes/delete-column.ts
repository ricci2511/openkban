import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';

export const deleteColumn = authedProcedure
    .input(
        z.object({
            id: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const deleteColumn = await ctx.prisma.boardColumn.delete({
                where: {
                    id: input.id,
                },
            });
            return deleteColumn;
        } catch (error) {
            throw internalServerError(deleteError('column'), error);
        }
    });
