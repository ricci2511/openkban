import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

/**
 * @param successCb callback to run after successful column creation
 * @returns createColumn function, isLoading state, error state
 */
const useCreateColumn = (successCb?: () => void) => {
    const addColumn = useKanbanStore((state) => state.addColumn);

    const {
        mutate: createColumn,
        isLoading,
        error,
    } = trpc.boardColumnRouter.create.useMutation({
        onSuccess: (column) => {
            // after successful creation add column to kanban store
            addColumn(column);
            successCb?.();
        },
    });
    return { createColumn, isLoading, error };
};

export default useCreateColumn;
