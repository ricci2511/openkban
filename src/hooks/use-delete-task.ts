import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

/**
 * @returns deleteTask function, isLoading state, error state
 */
const useDeleteTask = () => {
    const removeTask = useKanbanStore((state) => state.deleteTask);

    const {
        mutate: deleteTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.delete.useMutation({
        onSuccess: (task) => {
            // after successful deletion remove task from kanban store
            removeTask(task);
        },
    });
    return { deleteTask, isLoading, error };
};

export default useDeleteTask;
