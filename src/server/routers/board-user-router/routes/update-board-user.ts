import { authedRateLimitedProcedure } from '@server/middlewares';
import { invalidateSavedBoard } from '@server/redis/board';
import { z } from 'zod';

const schema = z.object({
    boardId: z.string(),
    isFavourite: z.boolean().optional(),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
});

export const updateBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardId, isFavourite, role } = input;

        const boardUser = await ctx.prisma.boardUser.update({
            where: {
                boardId_userId: {
                    boardId,
                    userId: ctx.session.user.id,
                },
            },
            data: {
                isFavourite,
                role,
            },
        });

        await invalidateSavedBoard(boardId);

        return boardUser;
    });
