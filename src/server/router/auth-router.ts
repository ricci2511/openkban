import * as trpc from '@trpc/server';
import { createRouter } from './context';
import { createProtectedRouter } from './protected-router';

/**
 * These queries can only be hit if the user requesting them is signed in.
 * See ./protected-router.ts for more information.
 */
export const authRouter = createProtectedRouter().query('getSession', {
    resolve({ ctx }) {
        return ctx.session;
    },
});
