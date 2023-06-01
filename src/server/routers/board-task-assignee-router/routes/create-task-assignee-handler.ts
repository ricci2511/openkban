import { forbidden, internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { queryBoardUserProperty } from '@server/routers/board-user-router/routes/get-board-user';
import { z } from 'zod';

const schema = z.object({
    boardUserId: z.string().cuid(),
    taskId: z.string().cuid(),
    boardId: z.string().cuid(),
});

export const createTaskAssigneeHandler = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId, taskId, boardId } = input;

        try {
            const role = await queryBoardUserProperty(
                ctx.session.user.id,
                boardId,
                'role',
                ctx.prisma
            );

            if (role === 'VIEWER') {
                throw forbidden('You are not allowed to create task assignees');
            }

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
