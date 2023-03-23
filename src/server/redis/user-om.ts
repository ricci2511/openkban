import { Repository, Schema } from 'redis-om';
import { redisClient } from '.';

// might expand this to hold session data
const userSchema = new Schema('user', {
    boardIds: { type: 'string[]' },
});

export const userRepository = new Repository(userSchema, redisClient);

export type CachedUser = {
    boardIds?: string[];
};

export const cacheBoardIds = async (userId: string, boardIds: string[]) => {
    await userRepository.save(userId, { boardIds });
};

export const cacheBoardId = async (userId: string, boardId: string) => {
    await redisClient.json.arrAppend(`user:${userId}`, '.boardIds', boardId);
};
