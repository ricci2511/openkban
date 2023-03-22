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

export const cacheUserBoardIds = async (userId: string, boardIds: string[]) => {
    userRepository.save(userId, { boardIds });
};
