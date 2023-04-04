import { trpc } from '@lib/trpc';
import { useSubtasksActions } from 'store/kanban-store';

export const useCreateSubtask = (successCb?: () => void) => {
    const { addSubtask } = useSubtasksActions();

    const createSubtaskMutation = trpc.boardSubtaskRouter.create.useMutation({
        onSuccess: (subtask) => {
            if (!subtask) return;
            addSubtask(subtask);
            successCb?.();
        },
    });

    return createSubtaskMutation;
};
