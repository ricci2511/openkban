import { authedRateLimitedProcedure } from '@server/middlewares';
import { invalidateSavedBoard } from '@server/redis/board';
import { invalidateBoardIds } from '@server/redis/user-board-ids';
import { z } from 'zod';

const schema = z.object({
    boardId: z.string().cuid(),
});

export const deleteBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const boardId = input.boardId;

        try {
            const boardUser = await ctx.prisma.boardUser.delete({
                where: {
                    boardId_userId: {
                        boardId,
                        userId,
                    },
                },
            });

            await invalidateBoardIds(userId);
            await invalidateSavedBoard(boardId);

            return boardUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
