import { t } from '@server/trpc';
import { authedProcedure } from './auth-router';
import { z } from 'zod';
import { boardColumnCreationSchema } from '@lib/schemas/board-schemas';

export const boardColumnRouter = t.router({
    getAllByBoardId: authedProcedure
        .input(z.object({ boardId: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            const columns = await ctx.prisma.boardColumn.findMany({
                where: {
                    boardId: input.boardId,
                },
                include: {
                    tasks: true,
                },
            });
            return columns;
        }),
    create: authedProcedure
        .input(boardColumnCreationSchema)
        .mutation(async ({ ctx, input }) => {
            const createColumn = await ctx.prisma.boardColumn.create({
                data: {
                    title: input.title,
                    color: input.color,
                    tasks: {
                        create: [],
                    },
                    board: {
                        connect: {
                            id: input.boardId,
                        },
                    },
                },
            });
            return createColumn;
        }),
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
