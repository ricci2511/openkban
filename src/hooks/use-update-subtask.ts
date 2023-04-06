import { trpc } from '@lib/trpc';
import { useSubtasksActions } from 'store/kanban-store';

export const useUpdateSubtask = (successCb?: () => void) => {
    const { updateSubtask } = useSubtasksActions();

    const updateSubtaskMutation = trpc.boardSubtaskRouter.update.useMutation({
        onSuccess: (subtask) => {
            if (!subtask) return;
            updateSubtask(subtask);
            successCb?.();
        },
    });

    return updateSubtaskMutation;
};
