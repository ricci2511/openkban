import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from 'env.mjs';

export const DEFAULT_EXPIRE_TIME = 60 * 60 * 24; // 24 hours

export const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * A maximum of 10 tokens are added to the bucket every 45 seconds.
 *
 * Each request consumes 1 token. Once the limit is reached, requests are
 * rejected until the interval of 45 seconds is over.
 */
export const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.tokenBucket(8, '45 s', 8),
    analytics: true,
});
