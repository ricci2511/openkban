import { adminBoardUserProcedure } from '@server/middlewares';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { PrismaClient } from '@prisma/client';
import {
    getBoardAdmin,
    isValidEntityOwner,
    transferAllEntitiesOwnership,
} from '../helpers';

export const deleteBoardUserMutation = async (
    id: string,
    prisma: PrismaClient
) => await prisma.boardUser.delete({ where: { id } });

const schema = z.object({
    boardUserId: z.string().cuid(),
});

export const deleteBoardUser = adminBoardUserProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId, boardId } = input;

        try {
            // find board user to delete and include all entities owned by the user
            const boardUser = await ctx.prisma.boardUser.findUnique({
                where: { id: boardUserId },
                include: { columns: true, tasks: true, subtasks: true },
            });

            if (!boardUser) {
                throw internalServerError(
                    'Could not find board user to delete'
                );
            }

            // if the board user being deleted is not a valid owner, meaning they are a viewer or do not own any entities
            // then just delete the board user and return
            if (!isValidEntityOwner(boardUser)) {
                return deleteBoardUserMutation(boardUserId, ctx.prisma);
            }

            // query for a board admin to transfer ownership of all entities to
            const boardAdmin = await getBoardAdmin(
                boardId,
                ctx.prisma,
                boardUser.id // exclude the board user to be deleted from the query
            );

            // transfer ownership of all entities owned by the user to be deleted to the board admin
            if (boardAdmin) {
                const entities = {
                    columns: boardUser.columns,
                    tasks: boardUser.tasks,
                    subtasks: boardUser.subtasks,
                };
                await transferAllEntitiesOwnership(
                    entities,
                    boardAdmin.id,
                    ctx.prisma
                );
            }

            // after the transfer delete the board user
            return deleteBoardUserMutation(boardUserId, ctx.prisma);
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
