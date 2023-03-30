import { trpc } from '@lib/trpc';
import { useColumnsActions } from 'store/kanban-store';

/**
 * @returns delete column trpc mutation object
 */
const useDeleteColumn = () => {
    const { deleteColumn } = useColumnsActions();

    const deleteColumnMutation = trpc.boardColumnRouter.delete.useMutation({
        onSuccess: (column) => {
            deleteColumn(column.id);
        },
    });
    return deleteColumnMutation;
};

export default useDeleteColumn;
