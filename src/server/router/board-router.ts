import { t } from '@server/trpc';
import { z } from 'zod';
import { authedProcedure } from './auth-router';

export const boardRouter = t.router({
    create: authedProcedure
        .input(
            z.object({
                title: z.string().min(2).max(30),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const board = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    userId: ctx.session.user.id,
                },
            });
            return board;
        }),
    getAll: authedProcedure.query(async ({ ctx }) => {
        const boards = await ctx.prisma.board.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
        return boards;
    }),
});
