import { internalServerError, notFound } from '@server/helpers/error-helpers';
import { z } from 'zod';
import { queryError } from '@server/routers/common-errors';
import { authedRateLimitedProcedure } from '@server/middlewares';

export const getAllSubtasks = authedRateLimitedProcedure
    .input(
        z.object({
            taskId: z.string().cuid(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            const subtasks = await ctx.prisma.boardSubtask.findMany({
                where: {
                    taskId: input.taskId,
                },
            });
            if (!subtasks) return notFound('Subtasks not found');
            return subtasks;
        } catch (error) {
            const message = queryError('subtask', false);
            throw internalServerError(message, error);
        }
    });
