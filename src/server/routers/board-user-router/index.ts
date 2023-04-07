import { t } from '@server/trpc';
import { getBoardUserRole } from './routes/get-board-user-role';

export const boardUserRouter = t.router({
    getRole: getBoardUserRole,
});
