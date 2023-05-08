import { internalServerError } from '@server/helpers/error-helpers';
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

export const deleteBoard = adminBoardUserProcedure.mutation(
    async ({ ctx, input }) => {
        try {
            const board = await deleteBoardMutation(input.boardId, ctx.prisma);
            return board;
        } catch (error) {
            throw internalServerError(deleteError('board'), error);
        }
    }
);
