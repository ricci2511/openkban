import { internalServerError, notFound } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';

const schema = z.object({
    boardUserId: z.string(),
    taskId: z.string(),
});

export const deleteTaskAssigneeHandler = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId, taskId } = input;

        try {
            // find the task assignee to delete
            const assignee = await ctx.prisma.boardTaskAssignee.findFirst({
                where: {
                    boardUserId,
                    boardTask: {
                        id: taskId,
                    },
                },
                select: {
                    id: true,
                },
            });

            if (!assignee) {
                throw notFound(
                    "The task assignee you're trying to delete was not found"
                );
            }

            const taskAssignee = await ctx.prisma.boardTaskAssignee.delete({
                where: {
                    id: assignee.id,
                },
            });

            return taskAssignee;
        } catch (error) {
            throw internalServerError(
                'There was an error while deleting the task assignee',
                error
            );
        }
    });
