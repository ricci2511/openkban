import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

const useUpdateTask = (successCb?: () => void) => {
    const updateStoreTask = useKanbanStore((state) => state.updateTask);

    const updateTaskMutation = trpc.boardTaskRouter.update.useMutation({
        onSuccess: (task) => {
            updateStoreTask(task);
            successCb?.();
        },
    });
    return updateTaskMutation;
};

export default useUpdateTask;
