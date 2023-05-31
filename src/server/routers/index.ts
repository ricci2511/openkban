import { userRouter } from './user-router';
import { boardUserRouter } from './board-user-router';
import { authRouter } from './auth-router';
import { boardRouter } from './board-router';
import { t } from '@server/trpc';
import { boardTaskRouter } from './board-task-router';
import { boardColumnRouter } from './board-column-router';
import { boardSubtaskRouter } from './board-subtask-router';
import { boardPermissionRouter } from './board-permission-router';
import { boardTaskAssigneeRouter } from './board-task-assignee-router';

export const appRouter = t.router({
    authRouter,
    boardRouter,
    boardTaskRouter,
    boardColumnRouter,
    boardSubtaskRouter,
    userRouter,
    boardUserRouter,
    boardPermissionRouter,
    boardTaskAssigneeRouter,
});

export type AppRouter = typeof appRouter;
