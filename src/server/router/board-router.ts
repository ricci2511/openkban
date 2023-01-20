import { t } from '@server/trpc';
import { z } from 'zod';
import { authedProcedure } from './auth-router';
import { boardCeationSchema } from '@lib/schemas/board-schemas';
import { randomNoRepeats } from '@lib/helpers';
import { colors } from '@lib/constants';
import { BoardData } from 'types/board-types';

export const boardRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        const boards = await ctx.prisma.board.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
        return boards;
    }),
    getById: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input }) => {
            const board = await ctx.prisma.board.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    columns: {
                        include: {
                            tasks: true,
                        },
                    },
                },
            });
            return board as BoardData | null;
        }),
    create: authedProcedure
        .input(boardCeationSchema)
        .mutation(async ({ ctx, input }) => {
            const randomColor = randomNoRepeats(colors);
            const createBoard = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    isFavourite: input.isFavourite,
                    userId: ctx.session.user.id,
                    columns: {
                        create: input.columnTitles.map((title) => ({
                            title: title,
                            color: randomColor(),
                        })),
                    },
                },
            });
            return createBoard;
        }),
    update: authedProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                title: z.string().min(2).max(30).optional(),
                isFavourite: z.boolean().optional(),
                lastInteractedAt: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateBoard = await ctx.prisma.board.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    isFavourite: input.isFavourite,
                    lastInteractedAt: input.lastInteractedAt,
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
