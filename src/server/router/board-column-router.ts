import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { z } from 'zod';

export const boardColumnRouter = t.router({
    update: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                title: z.string().optional(),
                color: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateColumn = await ctx.prisma.boardColumn.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    color: input.color,
                },
            });
            return updateColumn;
        }),
    delete: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deleteColumn = await ctx.prisma.boardColumn.delete({
                where: {
                    id: input.id,
                },
            });
            return deleteColumn;
        }),
});
