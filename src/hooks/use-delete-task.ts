import { trpc } from '@lib/trpc';
import { useTasksActions } from 'store/columns-tasks-store';

/**
 * @returns delete task trpc mutation object
 */
const useDeleteTask = () => {
    const { removeTask } = useTasksActions();

    const deleteTaskMutation = trpc.boardTaskRouter.delete.useMutation({
        onSuccess: ({ id, columnId }) => {
            // after successful deletion remove task from kanban store
            removeTask(id, columnId);
        },
    });
    return deleteTaskMutation;
};

export default useDeleteTask;
