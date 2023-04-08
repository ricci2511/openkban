import { t } from '@server/trpc';
import { getBoardUserRole } from './routes/get-board-user-role';
import { deleteBoardUser } from './routes/delete-board-user';
import { updateBoardUser } from './routes/update-board-user';

export const boardUserRouter = t.router({
    getRole: getBoardUserRole,
    delete: deleteBoardUser,
    update: updateBoardUser,
});
