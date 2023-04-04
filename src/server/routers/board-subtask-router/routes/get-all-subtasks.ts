import { internalServerError, notFound } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { queryError } from '@server/routers/common-errors';

export const getAllSubtasks = authedProcedure
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
