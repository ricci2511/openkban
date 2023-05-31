import { t } from '@server/trpc';
import { createTaskAssigneeHandler } from './routes/create-task-assignee-handler';
import { deleteTaskAssigneeHandler } from './routes/delete-task-assignee-handler';

export const boardTaskAssigneeRouter = t.router({
    create: createTaskAssigneeHandler,
    delete: deleteTaskAssigneeHandler,
});
