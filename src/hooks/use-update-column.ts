import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

const useUpdateColumn = (successCb?: () => void) => {
    const updateStoreCol = useKanbanStore((state) => state.updateColumn);

    const updateColumnMutation = trpc.boardColumnRouter.update.useMutation({
        onSuccess: (column) => {
            updateStoreCol(column);
            console.log(successCb);
            successCb?.();
        },
    });
    return updateColumnMutation;
};

export default useUpdateColumn;
