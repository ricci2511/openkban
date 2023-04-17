import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { queryBoardUserRole } from './get-board-user-role';
import { invalidateSavedBoard } from '@server/redis/board';
import { MAX_BOARD_USERS } from '@lib/constants';

const schema = z.array(
    z.object({
        boardId: z.string(),
        userId: z.string(),
        role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
    })
);

export const createBoardUser = authedRateLimitedProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        try {
            const boardId = input[0].boardId;

            const boardUserRole = await queryBoardUserRole(
                ctx.session.user.id,
                boardId,
                ctx.prisma
            );

            // make sure the user inviting users is an admin
            if (boardUserRole !== 'ADMIN') {
                throw unauthorized(
                    'You are not authorized to create board users.'
                );
            }

            // check if board has reached max users
            const boardUsersCount = await ctx.prisma.boardUser.count({
                where: { boardId },
            });
            if (boardUsersCount > MAX_BOARD_USERS) {
                throw internalServerError(
                    `Only ${MAX_BOARD_USERS} users per board are allowed.`
                );
            }

            const boardUsers = await ctx.prisma.boardUser.createMany({
                data: input.map(({ boardId, userId, role }) => ({
                    boardId,
                    userId,
                    role,
                })),
                skipDuplicates: true,
            });

            await invalidateSavedBoard(boardId);

            return boardUsers;
        } catch (error) {
            throw internalServerError(
                'Could not create board user/s. Please try again later.',
                error
            );
        }
    });
