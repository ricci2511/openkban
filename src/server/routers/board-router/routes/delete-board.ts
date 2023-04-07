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

export const deleteBoard = authedProcedure
    .input(
        z.object({
            id: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const id = input.id;
        const userId = ctx.session.user.id;

        const role = await queryBoardUserRole(userId, id, ctx.prisma);
        if (role !== 'ADMIN') {
            throw unauthorized('Your user is not an admin of the board.');
        }

        try {
            const board = await ctx.prisma.board.delete({
                where: {
                    id,
                },
                include: {
                    boardUser: {
                        select: {
                            userId: true,
                        },
                    },
                },
            });

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
