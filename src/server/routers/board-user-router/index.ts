import { t } from '@server/trpc';
import { getBoardUserRole } from './routes/get-board-user-role';
import { updateBoardUser } from './routes/update-board-user';
import { leaveBoard } from './routes/leave-board';
import { deleteBoardUser } from './routes/delete-board-user';

export const boardUserRouter = t.router({
    getRole: getBoardUserRole,
    leaveBoard: leaveBoard,
    delete: deleteBoardUser,
    update: updateBoardUser,
});
