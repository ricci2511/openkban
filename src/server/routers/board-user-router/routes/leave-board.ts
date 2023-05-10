import { authedRateLimitedProcedure } from '@server/middlewares';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { deleteBoardMutation } from '@server/routers/board-router/routes/delete-board';
import { BoardUser, PrismaClient } from '@prisma/client';
import {
    getBoardAdmin,
    isValidEntityOwner,
    transferAllEntitiesOwnership,
} from '../helpers';
import { deleteBoardUserMutation } from './delete-board-user';

const reassignAdmin = async (boardUserIds: string[], prisma: PrismaClient) => {
    const randomIndex = Math.floor(Math.random() * boardUserIds.length);
    const newAdminId = boardUserIds[randomIndex];

    // reassign adminship to a random remaining user (FOR NOW)
    return await prisma.boardUser.update({
        where: {
            id: newAdminId,
        },
        data: {
            role: 'ADMIN',
        },
    });
};

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
            // query board user id of all the board users
            const boardUsers = await ctx.prisma.boardUser.findMany({
                where: { boardId },
                select: { id: true },
            });

            // if the user is the only user left, delete the board entirely and return early
            if (boardUsers.length === 1) {
                await deleteBoardMutation(boardId, ctx.prisma);
                return { boardId } as PartialExcept<BoardUser, 'boardId'>;
            }

            // find board user that is leaving and include all entities owned by the user
            const boardUser = await ctx.prisma.boardUser.findUnique({
                where: { id: boardUserId },
                include: { columns: true, tasks: true, subtasks: true },
            });

            if (!boardUser) {
                throw internalServerError(
                    'Could not find board user trying to leave'
                );
            }

            // if the board user being deleted is not a valid owner, meaning they are a viewer or do not own any entities
            // then just delete the board user and return
            if (!isValidEntityOwner(boardUser)) {
                console.log('NOT VALID OWNER, DELETING BOARD USER ONLY');
                return deleteBoardUserMutation(boardUserId, ctx.prisma);
            }

            // query for a board admin, excluding the board user to leave
            // if the leaving board user is the only admin, then this will be null
            const boardAdmin = await getBoardAdmin(
                boardId,
                ctx.prisma,
                boardUser.id
            );

            // entities owned by the leaving user
            const ownedEntities = {
                columns: boardUser.columns,
                tasks: boardUser.tasks,
                subtasks: boardUser.subtasks,
            };

            // transfer ownership of all entities owned by the leaving user to the board admin
            if (boardAdmin) {
                console.log('TRANSFERING OWNERSHIP TO ADMIN');

                await transferAllEntitiesOwnership(
                    ownedEntities,
                    boardAdmin.id,
                    ctx.prisma
                );
            } else {
                // if the user was the only admin left, transfer adminship to a random user
                console.log('TRANSFERING ADMINSHIP TO RANDOM USER');

                const remainingUsers = boardUsers
                    .filter((bu) => bu.id !== boardUserId)
                    .map((bu) => bu.id);

                const newAdmin = await reassignAdmin(
                    remainingUsers,
                    ctx.prisma
                );

                // finally, transfer ownership of all entities owned by the old admin to the new admin
                await transferAllEntitiesOwnership(
                    ownedEntities,
                    newAdmin.id,
                    ctx.prisma
                );
            }

            return await deleteBoardUserMutation(boardUserId, ctx.prisma);
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
