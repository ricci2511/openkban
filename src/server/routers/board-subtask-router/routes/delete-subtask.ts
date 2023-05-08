import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { deleteError } from '@server/routers/common-errors';
import { z } from 'zod';

const schema = z.object({ id: z.string().cuid() });

export const deleteSubtask = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        try {
            const subtask = await ctx.prisma.boardSubtask.delete({
                where: { id: input.id },
            });

            return subtask;
        } catch (error) {
            throw internalServerError(deleteError('subtask'), error);
        }
    });
