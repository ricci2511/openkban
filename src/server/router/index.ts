import { authRouter } from './auth-router';
import { boardRouter } from './board-router';
import { t } from '@server/trpc';
import { boardTaskRouter } from './board-task-router';
import { boardColumnRouter } from './board-column-router';

export const appRouter = t.router({
    authRouter: authRouter,
    boardRouter: boardRouter,
    boardTaskRouter: boardTaskRouter,
    boardColumnRouter: boardColumnRouter,
});

export type AppRouter = typeof appRouter;
