import { authedRateLimitedProcedure } from '@server/middlewares';
import {
    deleteSavedBoard,
    getSavedBoardById,
    invalidateSavedBoard,
} from '@server/redis/board';
import { deleteBoardIdOrIds } from '@server/redis/user-board-ids';
import { z } from 'zod';
import { updateBoardUserMutation } from './update-board-user';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { deleteBoardMutation } from '@server/routers/board-router/routes/delete-board';
import { PrismaClient } from '@prisma/client';

const destroyBoard = async (
    boardId: string,
    userId: string,
    prisma: PrismaClient
) => {
    // db board deletion
    await deleteBoardMutation(boardId, prisma);
    // cache board deletion, including the board id from the user's board ids set
    await deleteSavedBoard([userId], boardId);
};

const reassignAdmin = async (
    boardId: string,
    userId: string,
    prisma: PrismaClient
) => {
    await updateBoardUserMutation(
        {
            boardId,
            userId,
            role: 'ADMIN',
        },
        prisma
    );
};

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

            // if the user was the admin, transfer adminship to another user
            const savedBoard = await getSavedBoardById(boardId);
            if (boardUser.role === 'ADMIN') {
                // if the board is cached, we can use the cached board users
                // otherwise, just query all user ids of the board users
                const savedBoardUsers = savedBoard
                    ? savedBoard.boardUser
                    : await ctx.prisma.boardUser.findMany({
                          where: { boardId },
                          select: { userId: true },
                      });

                const remaining = savedBoardUsers.filter(
                    (bu) => bu.userId !== userId
                );

                // if there are no remaining users, delete the board entirely and return early
                if (remaining.length === 0) {
                    await destroyBoard(boardId, userId, ctx.prisma);
                    return boardUser;
                }

                // reassign adminship to a random remaining user (FOR NOW)
                const randomIndex = Math.floor(
                    Math.random() * remaining.length
                );
                await reassignAdmin(
                    boardId,
                    remaining[randomIndex].userId,
                    ctx.prisma
                );
            }

            // sice the current user left the board, remove the board id from their board ids set
            await deleteBoardIdOrIds(userId, boardId);
            // if the board wasn't cached, there's no need to invalidate it
            if (savedBoard) await invalidateSavedBoard(boardId);

            return boardUser;
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
