import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { z } from 'zod';

export const boardTaskRouter = t.router({
    create: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                title: z.string().min(1).max(35),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const createTask = await ctx.prisma.boardTask.create({
                data: {
                    title: input.title,
                    column: { connect: { id: input.id } },
                },
            });
            return createTask;
        }),
});
