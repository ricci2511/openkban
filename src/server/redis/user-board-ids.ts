import { redis } from '.';

export const setKey = (userId: string) => `userBoards:${userId}`;

/**
 * @param userId
 * @returns array of board ids belonging to a user
 */
export const getSavedBoardIds = async (userId: string) => {
    try {
        return await redis.smembers(setKey(userId));
    } catch (error) {
        console.error(`ERROR getting ${setKey(userId)} set from Redis:`, error);
    }
};

/**
 * Creates a set with a board id or ids and sets an expiration time of 1 week.
 * @param userId
 * @param boardIdOrIds
 */
export const saveBoardIdOrIds = async (
    userId: string,
    boardIdOrIds: string | string[]
) => {
    const key = setKey(userId);
    try {
        await redis
            .pipeline()
            .sadd(key, boardIdOrIds)
            .expire(key, 60 * 60 * 24 * 7)
            .exec();
    } catch (error) {
        console.error(`ERROR saving ${key} set to Redis:`, error);
    }
};

/**
 * Appends a board id or ids to a existing set.
 * @param userId
 * @param boardIdOrIds
 */
export const addBoardIdOrIds = async (
    userId: string,
    boardIdOrIds: string | string[]
) => {
    try {
        await redis.sadd(setKey(userId), boardIdOrIds);
    } catch (error) {
        console.error(
            `ERROR adding ${boardIdOrIds} to ${setKey(userId)} set in Redis:`,
            error
        );
    }
};

/**
 * Checks if a userBoards set exists.
 * @param userId
 * @returns true if the set exists, otherwise false
 */
export const idsSetExists = async (userId: string) => {
    try {
        return !!(await redis.exists(setKey(userId)));
    } catch (error) {
        console.error(`ERROR checking if ${setKey(userId)} exists:`, error);
    }
};

/**
 * Adds a board id/ids to a set if it exists, otherwise it creates the set and adds the board id/ids.
 * @param userId
 * @param boardIdOrIds
 */
export const upsertBoardIds = async (
    userId: string,
    boardIdOrIds: string | string[]
) => {
    if (await idsSetExists(userId)) {
        // if the board id already exists it won't do anything
        await addBoardIdOrIds(userId, boardIdOrIds);
    } else {
        await saveBoardIdOrIds(userId, boardIdOrIds);
    }
};
