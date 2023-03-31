import { Redis } from '@upstash/redis';

export const DEFAULT_EXPIRE_TIME = 60 * 60 * 24; // 24 hours

export const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});
