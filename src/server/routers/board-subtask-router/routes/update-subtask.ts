import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/middlewares';
import { updateError } from '@server/routers/common-errors';
import { z } from 'zod';

export const updateSubtask = authedProcedure
    .input(
        z.object({
            id: z.string(),
            title: z.string().optional(),
            isDone: z.boolean().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const subtask = await ctx.prisma.boardSubtask.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    isDone: input.isDone,
                },
            });

            return subtask;
        } catch (error) {
            throw internalServerError(updateError('subtask'), error);
        }
    });
