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
export type CreateSubtaskMutation = ReturnType<typeof useCreateSubtask>;

// TODO: delete subtask mutation

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
export type UpdateSubtaskMutation = ReturnType<typeof useUpdateSubtask>;
