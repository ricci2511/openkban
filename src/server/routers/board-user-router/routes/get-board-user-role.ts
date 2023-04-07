import { PrismaClient } from '@prisma/client';
import { notFound } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';

export const queryBoardUserRole = async (
    userId: string,
    boardId: string,
    prisma: PrismaClient
) => {
    const boardUser = await prisma.boardUser.findFirst({
        where: {
            userId,
            boardId,
        },
    });

    if (!boardUser?.role) return notFound('Board user not found.');

    return boardUser.role;
};

const schema = z.object({
    boardId: z.string().cuid(),
    userId: z.string().cuid(),
});

export const getBoardUserRole = authedRateLimitedProcedure
    .input(schema)
    .query(async ({ ctx, input }) => {
        const { boardId, userId } = input;
        const role = await queryBoardUserRole(userId, boardId, ctx.prisma);
        return role;
    });
