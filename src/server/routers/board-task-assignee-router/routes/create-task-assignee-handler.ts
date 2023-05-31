import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';

const schema = z.object({
    boardUserId: z.string(),
    taskId: z.string(),
});

export const createTaskAssigneeHandler = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId, taskId } = input;
        try {
            const taskAssignee = await ctx.prisma.boardTaskAssignee.create({
                data: {
                    boardUser: {
                        connect: {
                            id: boardUserId,
                        },
                    },
                    boardTask: {
                        connect: {
                            id: taskId,
                        },
                    },
                },
            });

            return taskAssignee;
        } catch (error) {
            throw internalServerError(
                'There was an error while creating the task assignee',
                error
            );
        }
    });
