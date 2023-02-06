import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

const useUpdateTask = () => {
    const utils = trpc.useContext().boardRouter.getById;
    const columns = useKanbanStore((state) => state.columnTasks);

    const { mutate: updateTask, error } =
        trpc.boardTaskRouter.update.useMutation({
            onSuccess: (task) => {
                const { boardId } = columns[task.columnId];
                // update cached columns data with columns from the store which is up to date
                utils.setData({ id: boardId }, (board) => {
                    if (!board) return;
                    return {
                        ...board,
                        columns: Object.values(columns),
                    };
                });
            },
        });
    return { updateTask, error };
};

export default useUpdateTask;
