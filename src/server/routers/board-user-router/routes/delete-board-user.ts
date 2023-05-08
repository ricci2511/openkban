import { adminBoardUserProcedure } from '@server/middlewares';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';

const schema = z.object({
    boardId: z.string().cuid(),
    boardUserId: z.string().cuid(),
});

export const deleteBoardUser = adminBoardUserProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId } = input;

        try {
            const boardUser = await ctx.prisma.boardUser.delete({
                where: { id: boardUserId },
            });

            return boardUser;
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
