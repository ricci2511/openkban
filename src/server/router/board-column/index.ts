import { t } from '@server/trpc';
import { authedProcedure } from '../auth-router';
import { z } from 'zod';
import { boardColumnCreationSchema } from '@lib/schemas/board-schemas';
import { PrismaClient } from '@prisma/client';
import { internalServerError } from '@server/trpc-error-helpers';
import { COLUMNS_TASKS_QUERY_ERROR } from './errors';

export const queryColumnsByBoardId = async (
    prisma: PrismaClient,
    boardId: string
) => {
    try {
        return await prisma.boardColumn.findMany({
            where: {
                boardId,
            },
            include: {
                tasks: true,
            },
        });
    } catch (error) {
        throw internalServerError(COLUMNS_TASKS_QUERY_ERROR, error);
    }
};

export const boardColumnRouter = t.router({
    getAllByBoardId: authedProcedure
        .input(z.object({ boardId: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            return await queryColumnsByBoardId(ctx.prisma, input.boardId);
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
