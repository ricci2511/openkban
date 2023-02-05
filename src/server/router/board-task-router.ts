import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { boardTaskCreationSchema } from '@lib/schemas/board-schemas';
import { z } from 'zod';

export const boardTaskRouter = t.router({
    create: authedProcedure
        .input(boardTaskCreationSchema.extend({ rank: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const createTask = await ctx.prisma.boardTask.create({
                data: {
                    title: input.title,
                    column: { connect: { id: input.columnId } },
                    startDate: input.startDate,
                    dueDate: input.dueDate,
                    rank: input.rank,
                },
            });
            return createTask;
        }),
    updateRank: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                rank: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateTaskRank = await ctx.prisma.boardTask.update({
                where: {
                    id: input.id,
                },
                data: {
                    rank: input.rank,
                },
            });
            return updateTaskRank;
        }),
    updateColumnId: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                columnId: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateTaskColumnId = await ctx.prisma.boardTask.update({
                where: {
                    id: input.id,
                },
                data: {
                    columnId: input.columnId,
                },
            });
            return updateTaskColumnId;
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
