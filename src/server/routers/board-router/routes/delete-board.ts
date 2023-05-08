import { internalServerError } from '@server/helpers/error-helpers';
import { z } from 'zod';
import { deleteError } from '@server/routers/common-errors';
import { PrismaClient } from '@prisma/client';
import { adminBoardUserProcedure } from '@server/middlewares';

export const deleteBoardMutation = (boardId: string, prisma: PrismaClient) => {
    return prisma.board.delete({
        where: {
            id: boardId,
        },
        include: {
            boardUser: {
                select: {
                    userId: true,
                },
            },
        },
    });
};

const schema = z.object({ id: z.string().cuid() });

export const deleteBoard = adminBoardUserProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const id = input.id;

        try {
            const board = await deleteBoardMutation(id, ctx.prisma);
            return board;
        } catch (error) {
            throw internalServerError(deleteError('board'), error);
        }
    });
