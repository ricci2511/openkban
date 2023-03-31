import { t } from '@server/trpc';
import { getAllBoards } from './routes/get-all-boards';
import { getBoardById } from './routes/get-board-by-id';
import { createBoard } from './routes/create-board';
import { updateBoard } from './routes/update-board';
import { deleteBoard } from './routes/delete-board';

export const boardRouter = t.router({
    // Gets all boards that the user has access to (only metadata, not columns or tasks)
    getAll: getAllBoards,
    // Gets a single board by ID (including columns and tasks)
    getById: getBoardById,
    create: createBoard,
    update: updateBoard,
    delete: deleteBoard,
});
