import { t } from '@server/trpc';
import { TRPCError } from '@trpc/server';

const authMiddleware = t.middleware(({ ctx, next }) => {
    // any query that uses this middleware will throw
    // an error unless there is a current session
    if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            // Old context will automatically be spread.
            session: ctx.session,
        },
    });
});

const authedProcedure = t.procedure.use(authMiddleware);

export const authRouter = t.router({
    getSession: t.procedure.query(({ ctx }) => {
        // The session object is added to the routers context
        // in the context file server side
        return ctx.session;
    }),
    getSecretCode: authedProcedure.query(async () => {
        const secretCode = 'the cake is a lie.';
        return secretCode;
    }),
});
