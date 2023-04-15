import { PrismaClient } from '@prisma/client';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { invalidateSavedBoard } from '@server/redis/board';
import { z } from 'zod';
import { queryBoardUserRole } from './get-board-user-role';
import { unauthorized } from '@server/helpers/error-helpers';

const schema = z.object({
    boardId: z.string(),
    userId: z.string().optional(), // optional because the current user will be updated if not provided
    isFavourite: z.boolean().optional(),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
});

type UpdateInput = z.infer<typeof schema> & { sessionUserId: string };

export const updateBoardUserMutation = async (
    input: UpdateInput,
    prisma: PrismaClient
) => {
    const { sessionUserId, boardId, userId, isFavourite, role } = input;

    // if a userId is provided, then the current user is updating another user
    if (userId && userId !== sessionUserId) {
        const currUserRole = await queryBoardUserRole(
            sessionUserId,
            boardId,
            prisma
        );
        if (currUserRole !== 'ADMIN') {
            throw unauthorized('Only the admin can update other board users.');
        }

        // when updating another user, only the role can be updated
        return await prisma.boardUser.update({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            data: {
                role,
            },
        });
    }

    // otherwise, the current user is updating themselves
    return await prisma.boardUser.update({
        where: {
            boardId_userId: {
                boardId,
                userId: sessionUserId,
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
            { ...input, sessionUserId: ctx.session.user.id },
            ctx.prisma
        );

        await invalidateSavedBoard(input.boardId);

        return boardUser;
    });
