import { trpc } from '@lib/trpc';
import { useColumnsActions } from 'store/columns-tasks-store';

/**
 * @returns delete column trpc mutation object
 */
const useDeleteColumn = () => {
    const { removeColumn } = useColumnsActions();

    const deleteColumnMutation = trpc.boardColumnRouter.delete.useMutation({
        onSuccess: ({ id, boardId }) => {
            removeColumn(id, boardId);
        },
    });
    return deleteColumnMutation;
};

export default useDeleteColumn;
