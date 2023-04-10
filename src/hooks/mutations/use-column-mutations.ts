import { trpc } from '@lib/trpc';
import { useColumnsActions } from 'store/kanban-store';

/**
 * @param successCb callback to run after successful column creation
 * @returns create column trpc mutation object
 */
export const useCreateColumn = (successCb?: () => void) => {
    const { addColumn } = useColumnsActions();

    const createColumnMutation = trpc.boardColumnRouter.create.useMutation({
        onSuccess: (column) => {
            // after successful creation add column to kanban store
            addColumn(column);
            successCb?.();
        },
    });
    return createColumnMutation;
};
export type CreateColumnMutation = ReturnType<typeof useCreateColumn>;

/**
 * @returns delete column trpc mutation object
 */
export const useDeleteColumn = () => {
    const { deleteColumn } = useColumnsActions();

    const deleteColumnMutation = trpc.boardColumnRouter.delete.useMutation({
        onSuccess: (column) => {
            deleteColumn(column.id);
        },
    });
    return deleteColumnMutation;
};
export type DeleteColumnMutation = ReturnType<typeof useDeleteColumn>;

/**
 * @param successCb callback to run after successful column update
 * @returns update column trpc mutation object
 */
export const useUpdateColumn = (successCb?: () => void) => {
    const { updateColumn } = useColumnsActions();

    const updateColumnMutation = trpc.boardColumnRouter.update.useMutation({
        onSuccess: (column) => {
            updateColumn(column);
            successCb?.();
        },
    });
    return updateColumnMutation;
};
export type UpdateColumnMutation = ReturnType<typeof useUpdateColumn>;
