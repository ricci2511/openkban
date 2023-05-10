import {
    BoardColumn,
    BoardTask,
    BoardSubtask,
    PrismaClient,
    BoardUser,
} from '@prisma/client';
import { internalServerError } from '@server/helpers/error-helpers';

/**
 * @param boardId the board id to get the admin from
 * @param prisma prisma client
 * @param excludeBoardUserId optional board user id to exclude from the query
 * @param boardUserId optional board user id to query for, if not provided, a random admin will be returned
 * @returns a board admin or null if none found
 */
export const getBoardAdmin = async (
    boardId: string,
    prisma: PrismaClient,
    excludeBoardUserId?: string,
    boardUserId?: string
) => {
    try {
        return await prisma.boardUser.findFirst({
            where: {
                boardId,
                role: 'ADMIN',
                id: boardUserId,
                NOT: { id: excludeBoardUserId },
            },
        });
    } catch (error) {
        throw internalServerError('Could not get board admin', error);
    }
};

type Entities = {
    columns: BoardColumn[];
    tasks: BoardTask[];
    subtasks: BoardSubtask[];
};

/**
 * @param entities object of columns, tasks, and subtasks to transfer ownership of
 * @param toBoardUserId the board user id to transfer ownership to
 * @param prisma prisma client
 */
export const transferAllEntitiesOwnership = async (
    entities: Entities,
    toBoardUserId: string,
    prisma: PrismaClient
) => {
    const { columns, tasks, subtasks } = entities;

    try {
        await prisma.boardUser.update({
            where: { id: toBoardUserId },
            data: {
                columns: {
                    connect: columns.map((c) => ({
                        id: c.id,
                    })),
                },
                tasks: {
                    connect: tasks.map((t) => ({ id: t.id })),
                },
                subtasks: {
                    connect: subtasks.map((st) => ({
                        id: st.id,
                    })),
                },
            },
        });
    } catch (error) {
        throw internalServerError(
            'Could not transfer all entities ownership',
            error
        );
    }
};

type BoardUserWithEntities =
    | (BoardUser & {
          columns: BoardColumn[];
          tasks: BoardTask[];
          subtasks: BoardSubtask[];
      })
    | null;

/**
 *
 * @param owner the board user to check if they are a valid owner
 * @returns true if the owner is not a viewer and owns at least one entity, false otherwise
 */
export const isValidEntityOwner = (owner: BoardUserWithEntities) => {
    if (!owner) return false;

    const ownsAtLeastOneEntity =
        owner.columns.length || owner.tasks.length || owner.subtasks.length;

    return !!(owner.role !== 'VIEWER' && ownsAtLeastOneEntity);
};
