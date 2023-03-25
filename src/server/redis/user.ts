import { jsonGet, redisClient } from '.';

export type RedisUser = {
    boardIds?: string[];
};

export const getSavedUser = async (userId: string) => {
    return await jsonGet<RedisUser>(`user:${userId}`);
};

export const getSavedBoardIds = async (userId: string) => {
    return await jsonGet<string[]>(`user:${userId}`, '.boardIds');
};

export const saveBoardIds = async (userId: string, boardIds: string[]) => {
    await redisClient.json.set(`user:${userId}`, '.', { boardIds });
};

export const appendBoardId = async (userId: string, boardId: string) => {
    await redisClient.json.arrAppend(`user:${userId}`, '.boardIds', boardId);
};
