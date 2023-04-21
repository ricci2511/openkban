import { trpc } from '@lib/trpc';
import { useTasksActions } from 'store/kanban-store';

/**
 * @param successCb callback to run after successful task creation
 * @returns create task trpc mutation object
 */
export const useCreateTask = (successCb?: () => void) => {
    const { addTask } = useTasksActions();

    const createTaskMutation = trpc.boardTaskRouter.create.useMutation({
        onSuccess: (task) => {
            // after successful creation add task to kanban store
            addTask(task);
            successCb?.();
        },
    });
    return createTaskMutation;
};
export type CreateTaskMutation = ReturnType<typeof useCreateTask>;

/**
 * @returns delete task trpc mutation object
 */
export const useDeleteTask = () => {
    const { removeTask } = useTasksActions();

    const deleteTaskMutation = trpc.boardTaskRouter.delete.useMutation({
        onSuccess: ({ id, columnId }) => {
            // after successful deletion remove task from kanban store
            removeTask(id, columnId);
        },
    });
    return deleteTaskMutation;
};
export type DeleteTaskMutation = ReturnType<typeof useDeleteTask>;

/**
 * @param successCb callback to run after successful task update
 * @returns update task trpc mutation object
 */
export const useUpdateTask = () => {
    const { updateTask } = useTasksActions();

    const updateTaskMutation = trpc.boardTaskRouter.update.useMutation({
        onSuccess: (task) => {
            updateTask(task);
        },
    });
    return updateTaskMutation;
};
export type UpdateTaskMutation = ReturnType<typeof useUpdateTask>;
