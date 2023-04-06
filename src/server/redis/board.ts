import { BoardWithUsersRoles } from 'types/board-types';
import { redis, DEFAULT_EXPIRE_TIME } from '.';
import { getSavedBoardIds, setKey } from './user-board-ids';

// the date properties are stored as strings in Redis
type RedisBoard = TypeDatesToString<BoardWithUsersRoles>;

const hashKey = (boardId: string) => `board:${boardId}`;

const deserializeBoard = (board: RedisBoard): BoardWithUsersRoles => {
    return {
        ...board,
        createdAt: new Date(board.createdAt),
        lastInteractedAt: new Date(board.lastInteractedAt),
    };
};

/**
 * Retrieves the board from the cache if it exists.
 * @param boardId
 * @returns board if it exists in the cache, otherwise null
 */
export const getSavedBoardById = async (boardId: string) => {
    try {
        const board = await redis.get<RedisBoard>(hashKey(boardId));
        return board ? deserializeBoard(board) : null;
    } catch (error) {
        console.error(`ERROR getting saved board {${hashKey(boardId)}}`, error);
    }
};

/**
 * Retrieves boards from the cache if they exist.
 * @param boardIds array of board IDs
 * @returns array of non-deserialized boards or undefined
 */
const getSavedBoardsByIds = async (boardIds: string[]) => {
    try {
        return await redis.mget<RedisBoard[]>(
            ...boardIds.map((id) => hashKey(id))
        );
    } catch (error) {
        console.error('ERROR getting all saved boards', error);
    }
};

/**
 * Retrieves all cached boards available to the user, and if any are missing, return the missing board IDs to fetch them from the db.
 * @param userId
 * @returns object with boards and missingBoardIds array
 */
export const getAllSavedBoards = async (userId: string) => {
    // fetch the board IDs available to the user
    const boardIds = await getSavedBoardIds(userId);
    // if no board IDs, return null
    if (!boardIds || !boardIds.length) return null;

    const boards = await getSavedBoardsByIds(boardIds);
    if (!boards) return null;

    const result: { boards: BoardWithUsersRoles[]; missingBoardIds: string[] } =
        {
            boards: [],
            missingBoardIds: [],
        };

    for (let i = 0; i < boardIds.length; i++) {
        if (boards[i]) {
            result.boards.push(deserializeBoard(boards[i]));
        } else {
            result.missingBoardIds.push(boardIds[i]);
        }
    }

    return result;
};

/**
 * Caches the board object in redis with a default expiration time of 1 day if no expiration time is specified.
 * @param board
 * @param expireSeconds
 */
export const saveBoard = async (
    board: BoardWithUsersRoles,
    expireSeconds?: number
) => {
    try {
        await redis.set(hashKey(board.id), board, {
            ex: expireSeconds ?? DEFAULT_EXPIRE_TIME,
        });
    } catch (error) {
        console.error(`ERROR saving {${hashKey(board.id)}} in redis`, error);
    }
};

/**
 * Invalidates the board in the cache, e.g. when a board is updated.
 * @param boardId
 */
export const invalidateSavedBoard = async (boardId: string) => {
    try {
        await redis.del(hashKey(boardId));
    } catch (error) {
        console.error(
            `ERROR invalidating {${hashKey(boardId)}} in redis`,
            error
        );
    }
};

export const updateSavedBoard = async (
    id: string,
    board: BoardWithUsersRoles
) => {
    try {
        await redis.set(hashKey(id), board);
    } catch (error) {
        console.error(`ERROR updating {${hashKey(id)}} in redis`, error);
    }
};

/**
 * Completely deletes the board from the cache, including the boardId from the user's boardIds set.
 * @param userId
 * @param boardId
 */
export const deleteSavedBoard = async (userId: string, boardId: string) => {
    try {
        await redis
            .pipeline()
            .del(hashKey(boardId)) // delete the board
            .srem(setKey(userId), boardId) // remove the boardId from the user's boardIds set
            .exec();
    } catch (error) {
        console.error(`ERROR deleting {${hashKey(boardId)}} in redis`, error);
    }
};
