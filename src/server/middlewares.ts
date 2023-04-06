import { t } from '@server/trpc';
import { TRPCError } from '@trpc/server';
import { NextApiRequest } from 'next';
import { internalServerError } from './helpers/error-helpers';
import { createTRPCUpstashLimiter } from '@trpc-limiter/upstash';

export const apiMiddleware = t.middleware(({ ctx, next }) => {
    const { req, res } = ctx;
    if (!req || !res) {
        throw internalServerError('You are missing req or res in your call.');
    }

    return next({
        ctx: {
            req,
            res,
        },
    });
});
// basic procedure without auth
export const apiProcedure = t.procedure.use(apiMiddleware);

const authMiddleware = apiMiddleware.unstable_pipe(({ ctx, next }) => {
    // any query that uses this middleware will throw
    // an error unless there is a current session
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            /**
             * old context will automatically be spread.
             * infers that `session` is non-nullable to downstream resolvers
             */
            session: {
                ...ctx.session,
                user: ctx.session.user,
            },
        },
    });
});
export const authedProcedure = t.procedure.use(authMiddleware);

const getFingerprint = (req: NextApiRequest) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
        ? (typeof forwarded === 'string' ? forwarded : forwarded[0])?.split(
              /, /
          )[0]
        : req.socket.remoteAddress;
    return ip || '127.0.0.1';
};

const rateLimiterMiddlweware = createTRPCUpstashLimiter({
    root: t,
    fingerprint: (ctx, _input) => getFingerprint(ctx.req),
    windowMs: 60000,
    message: (hitInfo) =>
        `Too many requests, please try again in about ${Math.ceil(
            (hitInfo.reset - Date.now()) / 1000
        )} seconds.`,
    max: 12,
});

const authRateLimitterMiddleware = authMiddleware.unstable_pipe(
    rateLimiterMiddlweware
);

export const rateLimitedProcedure = t.procedure.use(rateLimiterMiddlweware);
export const authedRateLimitedProcedure = t.procedure.use(
    authRateLimitterMiddleware
);
