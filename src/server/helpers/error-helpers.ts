import { ratelimit } from '@server/redis';
import { TRPCError } from '@trpc/server';

export const internalServerError = (message: string, cause: unknown) => {
    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message,
        cause,
    });
};

export const notFound = (message: string) => {
    throw new TRPCError({
        code: 'NOT_FOUND',
        message,
    });
};

/**
 * @description Checks if the user has exceeded the rate limit and throws an 429 error if so
 * @param userId
 */
export const checkForRateLimit = async (key: string) => {
    const { success, limit } = await ratelimit.limit(key);
    if (!success) {
        throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: `Exceeded limit of ${limit} requests within 45 seconds.`,
        });
    }
};
