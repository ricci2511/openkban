import { t } from '@server/trpc';
import { getBoardUser } from './routes/get-board-user';
import { updateBoardUser } from './routes/update-board-user';
import { leaveBoard } from './routes/leave-board';
import { deleteBoardUser } from './routes/delete-board-user';
import { createBoardUser } from './routes/create-board-users';

export const boardUserRouter = t.router({
    getUser: getBoardUser,
    leaveBoard: leaveBoard,
    createUsers: createBoardUser,
    delete: deleteBoardUser,
    update: updateBoardUser,
});
