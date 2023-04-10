import { Prisma, PrismaClient } from '@prisma/client';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { invalidateSavedBoard } from '@server/redis/board';
import { z } from 'zod';

const schema = z.object({
    boardId: z.string(),
    isFavourite: z.boolean().optional(),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
});

type UpdateInput = z.infer<typeof schema> & { userId: string };

export const updateBoardUserMutation = async (
    input: UpdateInput,
    prisma: PrismaClient
) => {
    const { boardId, userId, isFavourite, role } = input;

    return await prisma.boardUser.update({
        where: {
            boardId_userId: {
                boardId,
                userId,
            },
        },
        data: {
            isFavourite,
            role,
        },
    });
};

export const updateBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const boardUser = await updateBoardUserMutation(
            { ...input, userId: ctx.session.user.id },
            ctx.prisma
        );

        await invalidateSavedBoard(input.boardId);

        return boardUser;
    });
