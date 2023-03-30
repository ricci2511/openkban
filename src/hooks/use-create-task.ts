import { trpc } from '@lib/trpc';
import { useTasksActions } from 'store/kanban-store';

/**
 * @param successCb callback to run after successful task creation
 * @returns create task trpc mutation object
 */
const useCreateTask = (successCb?: () => void) => {
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

export default useCreateTask;
