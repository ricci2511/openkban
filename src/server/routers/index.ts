import { authRouter } from './auth-router';
import { boardRouter } from './board-router';
import { t } from '@server/trpc';
import { boardTaskRouter } from './board-task-router';
import { boardColumnRouter } from './board-column-router';
import { boardSubtaskRouter } from './board-subtask-router';

export const appRouter = t.router({
    authRouter,
    boardRouter,
    boardTaskRouter,
    boardColumnRouter,
    boardSubtaskRouter,
});

export type AppRouter = typeof appRouter;
