import { t } from '@server/trpc';
import { createSubtask } from './routes/create-subtask';
import { getAllSubtasks } from './routes/get-all-subtasks';
import { updateSubtask } from './routes/update-subtask';

export const boardSubtaskRouter = t.router({
    getAllByTaskId: getAllSubtasks,
    create: createSubtask,
    update: updateSubtask,
});
