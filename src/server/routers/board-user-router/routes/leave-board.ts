import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { deleteBoardMutation } from '@server/routers/board-router/routes/delete-board';
import { transferEntitiesOwnership } from './delete-board-user';

const schema = z.object({
    boardId: z.string().cuid(),
    boardUserId: z.string().cuid(),
});

export const leaveBoard = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const boardId = input.boardId;
        const boardUserId = input.boardUserId;

        try {
            // first transfer ownership of all entities owned by the user
            await transferEntitiesOwnership(boardUserId, boardId, ctx.prisma);

            const boardUser = await ctx.prisma.boardUser.delete({
                where: {
                    id: boardUserId,
                },
            });

            const adminsCount = await ctx.prisma.boardUser.count({
                where: { boardId, role: 'ADMIN' },
            });

            // if the user was the admin and no more admins are left, transfer adminship to another user if any exist
            if (boardUser.role === 'ADMIN' && adminsCount === 0) {
                // query all user ids of the board users
                const boardUsers = await ctx.prisma.boardUser.findMany({
                    where: { boardId },
                    select: { id: true },
                });

                const remaining = boardUsers.filter(
                    (bu) => bu.id !== boardUserId
                );

                // if there are no remaining users, delete the board entirely and return early
                if (remaining.length === 0) {
                    await deleteBoardMutation(boardId, ctx.prisma);
                    return boardUser;
                }

                const randomIndex = Math.floor(
                    Math.random() * remaining.length
                );

                // reassign adminship to a random remaining user (FOR NOW)
                await ctx.prisma.boardUser.update({
                    where: {
                        id: remaining[randomIndex].id,
                    },
                    data: {
                        role: 'ADMIN',
                    },
                });
            }

            return boardUser;
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
