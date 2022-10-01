import { authRouter } from './auth-router';
import { t } from '@server/trpc';

export const appRouter = t.router({
    authRouter: authRouter,
});

export type AppRouter = typeof appRouter;
