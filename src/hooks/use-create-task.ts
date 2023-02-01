import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

/**
 * @param successCb callback to run after successful task creation
 * @returns createTask function, isLoading state, error state
 */
const useCreateTask = (successCb?: () => void) => {
    const addTask = useKanbanStore((state) => state.addTask);

    const {
        mutate: createTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.create.useMutation({
        onSuccess: (task) => {
            // after successful creation add task to kanban store instead of query cache
            addTask(task);
            successCb?.();
        },
    });
    return { createTask, isLoading, error };
};

export default useCreateTask;
