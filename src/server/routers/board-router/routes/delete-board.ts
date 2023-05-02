import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { deleteError } from '@server/routers/common-errors';
import { queryBoardUserProperty } from '@server/routers/board-user-router/routes/get-board-user';
import { PrismaClient } from '@prisma/client';

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
export const deleteBoard = authedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const id = input.id;
        const userId = ctx.session.user.id;

        const role = await queryBoardUserProperty(
            userId,
            id,
            'role',
            ctx.prisma
        );

        if (role !== 'ADMIN') {
            throw unauthorized('Your user is not the admin of the board.');
        }

        try {
            const board = await deleteBoardMutation(id, ctx.prisma);
            return board;
        } catch (error) {
            throw internalServerError(deleteError('board'), error);
        }
    });
