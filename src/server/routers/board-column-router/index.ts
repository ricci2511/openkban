import { t } from '@server/trpc';
import { getAllColumns } from './routes/get-all-columns';
import { createColumn } from './routes/create-column';
import { updateColumn } from './routes/update-column';
import { deleteColumn } from './routes/delete-column';
import { getAllColumnsWithTasks } from './routes/get-all-columns-with-tasks';

export const boardColumnRouter = t.router({
    getAll: getAllColumns,
    getAllWithTasks: getAllColumnsWithTasks,
    create: createColumn,
    update: updateColumn,
    delete: deleteColumn,
});
