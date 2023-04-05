import { t } from '@server/trpc';
import { authedProcedure } from '../auth-router';
import { boardTaskCreationSchema } from '@lib/schemas/board-schemas';
import { z } from 'zod';
import { authedRateLimitedProcedure } from '@server/middlewares';

export const boardTaskRouter = t.router({
    getById: authedRateLimitedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
            const task = await ctx.prisma.boardTask.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    subtasks: true,
                },
            });
            return task;
        }),
    create: authedProcedure
        .input(boardTaskCreationSchema.extend({ rank: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const createTask = await ctx.prisma.boardTask.create({
                data: {
                    title: input.title,
                    description: input.description,
                    column: { connect: { id: input.columnId } },
                    startDate: input.startDate,
                    dueDate: input.dueDate,
                    rank: input.rank,
                },
            });
            return createTask;
        }),
    update: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                rank: z.string().optional(),
                columnId: z.string().cuid().optional(),
                title: z.string().optional(),
                description: z.string().optional(),
                startDate: z.date().optional(),
                dueDate: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateTask = await ctx.prisma.boardTask.update({
                where: {
                    id: input.id,
                },
                data: {
                    rank: input.rank,
                    columnId: input.columnId,
                    title: input.title,
                    description: input.description,
                    startDate: input.startDate,
                    dueDate: input.dueDate,
                },
            });
            return updateTask;
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
