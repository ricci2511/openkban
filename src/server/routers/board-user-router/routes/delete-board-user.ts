import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { queryBoardUserProperty } from './get-board-user';
import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';

const schema = z.object({
    boardId: z.string().cuid(),
    boardUserId: z.string().cuid(),
});

export const deleteBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardId, boardUserId } = input;
        const currUserId = ctx.session.user.id;

        const role = await queryBoardUserProperty(
            currUserId,
            boardId,
            'role',
            ctx.prisma
        );
        if (role !== 'ADMIN') {
            throw unauthorized(
                'Only the admin can delete or kick board users.'
            );
        }

        try {
            const boardUser = await ctx.prisma.boardUser.delete({
                where: { id: boardUserId },
            });

            return boardUser;
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
