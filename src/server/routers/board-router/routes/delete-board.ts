import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { deleteSavedBoard } from '@server/redis/board';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { BOARD_CACHE_DELETE_ERROR } from '../errors';
import { deleteError } from '@server/routers/common-errors';
import { queryBoardUserRole } from '@server/routers/board-user-router/routes/get-board-user-role';
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

        const role = await queryBoardUserRole(userId, id, ctx.prisma);
        if (role !== 'ADMIN') {
            throw unauthorized('Your user is not the admin of the board.');
        }

        try {
            const board = await deleteBoardMutation(id, ctx.prisma);

            await deleteSavedBoard(
                board.boardUser.map((user) => user.userId),
                board.id
            ).catch((error) => {
                throw internalServerError(BOARD_CACHE_DELETE_ERROR, error);
            });

            return board;
        } catch (error) {
            throw internalServerError(deleteError('board'), error);
        }
    });
