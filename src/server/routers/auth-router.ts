import { t } from '@server/trpc';
import { TRPCError } from '@trpc/server';

const authMiddleware = t.middleware(({ ctx, next }) => {
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

export const authRouter = t.router({
    getSession: authedProcedure.query(async ({ ctx }) => {
        // The session object is added to the routers context
        // in the context file server side
        return ctx.session;
    }),
});
