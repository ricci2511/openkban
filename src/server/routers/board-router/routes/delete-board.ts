import { internalServerError } from '@server/helpers/error-helpers';
import { deleteSavedBoard } from '@server/redis/board';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { BOARD_CACHE_DELETE_ERROR } from '../errors';
import { deleteError } from '@server/routers/common-errors';

export const deleteBoard = authedProcedure
    .input(
        z.object({
            id: z.string().cuid(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const board = await ctx.prisma.board.delete({
                where: {
                    id: input.id,
                },
            });

            await deleteSavedBoard(ctx.session.user.id, board.id).catch(
                (error) => {
                    throw internalServerError(BOARD_CACHE_DELETE_ERROR, error);
                }
            );

            return board;
        } catch (error) {
            throw internalServerError(deleteError('board'), error);
        }
    });
