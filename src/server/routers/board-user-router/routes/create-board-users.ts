import { internalServerError } from '@server/helpers/error-helpers';
import { z } from 'zod';
import { MAX_BOARD_USERS } from '@lib/constants';
import { adminBoardUserProcedure } from '@server/middlewares';

const schema = z.object({
    boardUsers: z.array(
        z.object({
            userId: z.string(),
            role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
        })
    ),
});

export const createBoardUser = adminBoardUserProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        try {
            const boardId = input.boardId;

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
                input.boardUsers.map((bu) =>
                    ctx.prisma.boardUser.create({
                        data: {
                            boardId,
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
