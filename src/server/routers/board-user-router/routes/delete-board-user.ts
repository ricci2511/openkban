import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { queryBoardUserRole } from './get-board-user-role';
import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { deleteBoardIdOrIds } from '@server/redis/user-board-ids';
import { invalidateSavedBoard } from '@server/redis/board';

const schema = z.object({
    boardId: z.string().cuid(),
    userId: z.string().cuid(),
});

export const deleteBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardId, userId } = input;
        const currUserId = ctx.session.user.id;

        const role = await queryBoardUserRole(currUserId, boardId, ctx.prisma);
        if (role !== 'ADMIN') {
            throw unauthorized(
                'Only the admin can delete or kick board users.'
            );
        }

        try {
            const boardUser = await ctx.prisma.boardUser.delete({
                where: { boardId_userId: { boardId, userId } },
            });

            // delete the board id from the user's board ids set
            await deleteBoardIdOrIds(userId, boardId);
            // invalidate the board the user was deleted from
            await invalidateSavedBoard(boardId);

            return boardUser;
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
