import { authRouter } from './auth-router';
import { boardRouter } from './board-router';
import { t } from '@server/trpc';

export const appRouter = t.router({
    authRouter: authRouter,
    boardRouter: boardRouter,
});

export type AppRouter = typeof appRouter;
