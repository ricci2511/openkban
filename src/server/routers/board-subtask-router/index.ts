import { t } from '@server/trpc';
import { createSubtask } from './routes/create-subtask';
import { getAllSubtasks } from './routes/get-all-subtasks';

export const boardSubtaskRouter = t.router({
    getAllByTaskId: getAllSubtasks,
    create: createSubtask,
});
