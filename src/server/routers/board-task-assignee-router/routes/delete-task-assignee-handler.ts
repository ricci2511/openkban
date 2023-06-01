import {
    forbidden,
    internalServerError,
    notFound,
} from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { queryBoardUserProperty } from '@server/routers/board-user-router/routes/get-board-user';
import { z } from 'zod';

const schema = z.object({
    boardUserId: z.string().cuid(),
    taskId: z.string().cuid(),
    boardId: z.string().cuid(),
});

export const deleteTaskAssigneeHandler = authedRateLimitedProcedure
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
                throw forbidden('You are not allowed to remove task assignees');
            }

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
