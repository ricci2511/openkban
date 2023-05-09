import { adminBoardUserProcedure } from '@server/middlewares';
import { z } from 'zod';
import { internalServerError } from '@server/helpers/error-helpers';
import { deleteError } from '@server/routers/common-errors';
import { PrismaClient } from '@prisma/client';

export const transferEntitiesOwnership = async (
    boardUserId: string,
    boardId: string,
    prisma: PrismaClient
) => {
    try {
        // find board user to delete and include all entities owned by the user so we can disco
        const boardUser = await prisma.boardUser.findUnique({
            where: { id: boardUserId },
            include: { columns: true, tasks: true, subtasks: true },
        });

        if (!boardUser) {
            throw internalServerError('Could not find board user to delete');
        }

        const ownsAtLeastOneEntity =
            boardUser.columns.length ||
            boardUser.tasks.length ||
            boardUser.subtasks.length;

        // transfer ownership of all columns, tasks, and subtasks to a board admin
        // only if the user is not a viewer and owns at least one entity
        if (boardUser.role !== 'VIEWER' && ownsAtLeastOneEntity) {
            const boardAdmin = await prisma.boardUser.findFirst({
                where: {
                    boardId,
                    role: 'ADMIN',
                    NOT: { id: boardUserId }, // exclude the user we are deleting
                },
            });

            if (!boardAdmin) return;

            await prisma.boardUser.update({
                where: { id: boardAdmin.id },
                data: {
                    columns: {
                        connect: boardUser.columns.map((c) => ({
                            id: c.id,
                        })),
                    },
                    tasks: {
                        connect: boardUser.tasks.map((t) => ({ id: t.id })),
                    },
                    subtasks: {
                        connect: boardUser.subtasks.map((st) => ({
                            id: st.id,
                        })),
                    },
                },
            });
        }
    } catch (error) {
        throw internalServerError(
            'Could not transfer entities ownership',
            error
        );
    }
};

const schema = z.object({
    boardUserId: z.string().cuid(),
});

export const deleteBoardUser = adminBoardUserProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
        const { boardUserId, boardId } = input;

        try {
            // first transfer ownership of all entities owned by the user
            await transferEntitiesOwnership(boardUserId, boardId, ctx.prisma);

            // after the transfer delete the board user
            return await ctx.prisma.boardUser.delete({
                where: { id: boardUserId },
            });
        } catch (error) {
            throw internalServerError(deleteError('boardUser'), error);
        }
    });
