import { authRouter } from './auth-router';
import { boardRouter } from './board';
import { t } from '@server/trpc';
import { boardTaskRouter } from './board-task';
import { boardColumnRouter } from './board-column';
import { boardSubtaskRouter } from './board-subtask';

export const appRouter = t.router({
    authRouter: authRouter,
    boardRouter: boardRouter,
    boardTaskRouter: boardTaskRouter,
    boardColumnRouter: boardColumnRouter,
    boardSubtaskRouter: boardSubtaskRouter,
});

export type AppRouter = typeof appRouter;
