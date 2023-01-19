import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { z } from 'zod';
import { boardTaskCreationSchema } from '@lib/schemas/board-schemas';

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
});
