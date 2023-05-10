import { t } from '@server/trpc';
import { authedProcedure } from '../auth-router';
import { boardTaskCreationSchema } from '@lib/schemas/board-schemas';
import { z } from 'zod';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { queryBoardUserProperty } from '../board-user-router/routes/get-board-user';
import { ClientTask, ClientTaskWithSubTasks } from 'types/board-types';
import { notFound } from '@server/helpers/error-helpers';

export const boardTaskRouter = t.router({
    getById: authedRateLimitedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
            const taskWithSubtasks = await ctx.prisma.boardTask.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    subtasks: true,
                },
            });

            if (!taskWithSubtasks) {
                throw notFound('Could not find the selected task.');
            }

            return taskWithSubtasks as ClientTaskWithSubTasks;
        }),
    create: authedProcedure
        .input(
            boardTaskCreationSchema.extend({
                rank: z.string(),
                role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
                boardId: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const boardUserId = await queryBoardUserProperty(
                ctx.session.user.id,
                input.boardId,
                'id',
                ctx.prisma
            );

            const task = await ctx.prisma.boardTask.create({
                data: {
                    title: input.title,
                    description: input.description,
                    column: { connect: { id: input.columnId } },
                    startDate: input.startDate,
                    dueDate: input.dueDate,
                    rank: input.rank,
                    owner: {
                        connect: {
                            id: boardUserId,
                        },
                    },
                },
            });
            return task as ClientTask;
        }),
    update: authedRateLimitedProcedure
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
            const task = await ctx.prisma.boardTask.update({
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
            return task as ClientTask;
        }),
    delete: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.prisma.boardTask.delete({
                where: {
                    id: input.id,
                },
            });
            return task as ClientTask;
        }),
});
