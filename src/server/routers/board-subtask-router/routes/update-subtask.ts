import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { updateError } from '@server/routers/common-errors';
import { ClientSubtask } from 'types/board-types';
import { z } from 'zod';

export const updateSubtask = authedRateLimitedProcedure
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

            return subtask as ClientSubtask;
        } catch (error) {
            throw internalServerError(updateError('subtask'), error);
        }
    });
