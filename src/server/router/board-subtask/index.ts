import { t } from '@server/trpc';
import { authedProcedure } from '../auth-router';
import { z } from 'zod';

export const boardSubtaskRouter = t.router({
    getAllByTaskId: authedProcedure
        .input(
            z.object({
                taskId: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
            const subtasks = await ctx.prisma.boardSubtask.findMany({
                where: {
                    id: input.taskId,
                },
            });
            return subtasks;
        }),
});
