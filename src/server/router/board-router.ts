import { t } from '@server/trpc';
import { z } from 'zod';
import { authedProcedure } from './auth-router';

export const boardRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        const boards = await ctx.prisma.board.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
        return boards;
    }),
    create: authedProcedure
        .input(
            z.object({
                title: z.string().min(2).max(30),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const createBoard = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    userId: ctx.session.user.id,
                },
            });
            return createBoard;
        }),
    update: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                title: z.string().min(2).max(30),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateBoard = await ctx.prisma.board.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                },
            });
            return updateBoard;
        }),
    delete: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deleteBoard = await ctx.prisma.board.delete({
                where: {
                    id: input.id,
                },
            });
            return deleteBoard;
        }),
});
