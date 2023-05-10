import { PrismaClient } from '@prisma/client';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { queryBoardUserProperty } from './get-board-user';
import { notFound, unauthorized } from '@server/helpers/error-helpers';
import { getBoardAdmin, transferAllEntitiesOwnership } from '../helpers';

const schema = z.object({
    boardId: z.string(),
    boardUserId: z.string(),
    isFavourite: z.boolean().optional(),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).optional(),
});

type UpdateInput = z.infer<typeof schema>;

export const updateBoardUserMutation = async (
    input: UpdateInput,
    currUserId: string,
    prisma: PrismaClient
) => {
    const { boardId, boardUserId, isFavourite, role } = input;

    // get the user id of the board user being updated to check if it's the current user or not
    const boardUser = await prisma.boardUser.findUnique({
        where: { id: boardUserId },
        select: { userId: true, columns: true, tasks: true, subtasks: true },
    });

    if (!boardUser) throw notFound('Board user not found.');

    // if the role is being demoted to VIEWER, transfer all entities the user might own to a board admin
    // a viewer cannot own any entities
    if (role === 'VIEWER') {
        const entities = {
            columns: boardUser.columns,
            tasks: boardUser.tasks,
            subtasks: boardUser.subtasks,
        };

        const boardAdmin = await getBoardAdmin(boardId, prisma, boardUserId);
        if (boardAdmin) {
            await transferAllEntitiesOwnership(entities, boardAdmin.id, prisma);
        }
    }

    // the current user is updating another user
    if (boardUser.userId !== currUserId) {
        // make sure the current user is an admin
        const currUserRole = await queryBoardUserProperty(
            currUserId,
            boardId,
            'role',
            prisma
        );

        if (currUserRole !== 'ADMIN') {
            throw unauthorized('Only the admin can update other board users.');
        }

        // when updating another user, only the role can be updated
        return await prisma.boardUser.update({
            where: {
                id: boardUserId,
            },
            data: {
                role,
            },
        });
    }

    // otherwise, the current user is updating themselves
    return await prisma.boardUser.update({
        where: {
            id: boardUserId,
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
            input,
            ctx.session.user.id,
            ctx.prisma
        );

        return boardUser;
    });
