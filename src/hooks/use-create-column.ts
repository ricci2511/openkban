import { trpc } from '@lib/trpc';
import { useColumnsActions } from 'store/columns-tasks-store';

/**
 * @param successCb callback to run after successful column creation
 * @returns create column trpc mutation object
 */
const useCreateColumn = (successCb?: () => void) => {
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

export default useCreateColumn;
