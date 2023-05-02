import {
    internalServerError,
    unauthorized,
} from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { queryBoardUserProperty } from './get-board-user';
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

            const boardUserRole = await queryBoardUserProperty(
                ctx.session.user.id,
                boardId,
                'role',
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

            // this is a workaround
            // not using createMany because prismas createMany does not return the created records
            const boardUsers = await ctx.prisma.$transaction(
                input.map((bu) =>
                    ctx.prisma.boardUser.create({
                        data: {
                            boardId: bu.boardId,
                            userId: bu.userId,
                            role: bu.role,
                        },
                        select: {
                            id: true,
                            role: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    })
                )
            );

            return boardUsers;
        } catch (error) {
            throw internalServerError(
                'Could not create board user/s. Please try again later.',
                error
            );
        }
    });
