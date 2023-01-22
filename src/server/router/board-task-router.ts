import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { boardTaskCreationSchema } from '@lib/schemas/board-schemas';
import { z } from 'zod';

export const boardTaskRouter = t.router({
    create: authedProcedure
        .input(boardTaskCreationSchema)
        .mutation(async ({ ctx, input }) => {
            const createTask = await ctx.prisma.boardTask.create({
                data: {
                    title: input.title,
                    column: { connect: { id: input.columnId } },
                    startDate: input.startDate,
                    dueDate: input.dueDate,
                },
            });
            return createTask;
        }),
    delete: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deleteTask = await ctx.prisma.boardTask.delete({
                where: {
                    id: input.id,
                },
            });
            return deleteTask;
        }),
});
