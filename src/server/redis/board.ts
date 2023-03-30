import { redisClient, DEFAULT_EXPIRE_TIME, jsonGet } from '.';
import { getSavedBoardIds } from './user-board-ids';
import { Board } from '@prisma/client';

// in redisJSON the dates are stored as strings
type RedisBoard = TypeDatesToString<Board>;

const deserializeBoard = (board: RedisBoard): Board => {
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
export const getSavedBoard = async (boardId: string) => {
    const board = await jsonGet<RedisBoard>(`board:${boardId}`);
    return board ? deserializeBoard(board) : null;
};

/**
 * Retrieves all cached boards available to the user, and if any are missing, return the missing board IDs to fetch them from the db.
 * @param userId
 * @returns object with boards array, missingBoardIds array, and error if any
 */
export const getSavedBoards = async (userId: string) => {
    // fetch the board IDs available to the user
    const boardIds = await getSavedBoardIds(userId);
    // if no board IDs, return null
    if (!boardIds || !boardIds.length) return null;

    let boards: Board[] = [];
    let missingBoardIds: string[] = [];
    try {
        for (const id of boardIds) {
            const board = await getSavedBoard(id);
            if (board === null) {
                missingBoardIds.push(id);
            } else {
                boards.push(board);
            }
        }

        return { boards, missingBoardIds, error: null };
    } catch (error) {
        return { boards, missingBoardIds, error };
    }
};

/**
 * Caches the board object in redis with a default expiration time of 1 day if no expiration time is specified.
 * @param board
 * @param expireSeconds
 */
export const saveBoard = async (board: Board, expireSeconds?: number) => {
    const boardId = `board:${board.id}`;
    await redisClient
        .multi()
        .json.set(boardId, '.', board)
        .expire(boardId, expireSeconds ?? DEFAULT_EXPIRE_TIME)
        .exec();
};

/**
 * Invalidates the board in the cache, e.g. when a board is updated.
 * @param boardId
 */
export const invalidateBoard = async (boardId: string) => {
    await redisClient.json.del(`board:${boardId}`);
};

/**
 * Completely deletes the board from the cache, including the boardId from the user's boardIds array.
 * @param userId
 * @param boardId
 */
export const deleteBoard = async (userId: string, boardId: string) => {
    const boardIds = await getSavedBoardIds(userId);
    if (!boardIds) return;
    const index = boardIds.findIndex((id) => id === boardId);
    await redisClient
        .multi()
        .json.del(`board:${boardId}`)
        .json.arrPop(`user:${userId}`, '.boardIds', index)
        .exec();
};
