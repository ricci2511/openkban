import { Redis } from '@upstash/redis';
import { env } from 'env.mjs';

export const DEFAULT_EXPIRE_TIME = 60 * 60 * 6; // 6 hours

export const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});
