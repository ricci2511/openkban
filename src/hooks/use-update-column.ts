import { trpc } from '@lib/trpc';
import { useColumnsActions } from 'store/columns-tasks-store';

/**
 * @returns update column trpc mutation object
 */
const useUpdateColumn = (successCb?: () => void) => {
    const { updateColumn } = useColumnsActions();

    const updateColumnMutation = trpc.boardColumnRouter.update.useMutation({
        onSuccess: (column) => {
            updateColumn(column);
            successCb?.();
        },
    });
    return updateColumnMutation;
};

export default useUpdateColumn;
