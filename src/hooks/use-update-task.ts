import { trpc } from '@lib/trpc';
import { useTasksActions } from 'store/columns-tasks-store';

/**
 * @returns update task trpc mutation object
 */
const useUpdateTask = (successCb?: () => void) => {
    const { updateTask } = useTasksActions();

    const updateTaskMutation = trpc.boardTaskRouter.update.useMutation({
        onSuccess: (task) => {
            updateTask(task);
            successCb?.();
        },
    });
    return updateTaskMutation;
};

export default useUpdateTask;
