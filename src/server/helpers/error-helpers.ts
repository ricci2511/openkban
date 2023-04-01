import { ratelimit } from '@server/redis';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';

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
    const { success, reset, limit } = await ratelimit.limit(key);
    if (!success) {
        throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: `Exceeded limit of ${limit} requests. Try again in ${dayjs(
                reset * 1000
            ).format('ss')} seconds.`,
        });
    }
};
