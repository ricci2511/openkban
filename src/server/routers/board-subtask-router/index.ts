import { t } from '@server/trpc';
import { createSubtask } from './routes/create-subtask';
import { getAllSubtasks } from './routes/get-all-subtasks';
import { updateSubtask } from './routes/update-subtask';
import { deleteSubtask } from './routes/delete-subtask';

export const boardSubtaskRouter = t.router({
    getAllByTaskId: getAllSubtasks,
    create: createSubtask,
    delete: deleteSubtask,
    update: updateSubtask,
});
