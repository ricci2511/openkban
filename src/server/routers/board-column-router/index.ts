import { t } from '@server/trpc';
import { getAllColumnsByBoardId } from './routes/get-all-columns-by-board-id';
import { createColumn } from './routes/create-column';
import { updateColumn } from './routes/update-column';
import { deleteColumn } from './routes/delete-column';

export const boardColumnRouter = t.router({
    getAllByBoardId: getAllColumnsByBoardId,
    create: createColumn,
    update: updateColumn,
    delete: deleteColumn,
});
