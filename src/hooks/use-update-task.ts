import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

const useUpdateTask = () => {
    const utils = trpc.useContext().boardRouter.getById;
    const columns = useKanbanStore((state) => state.columnTasks);

    const { mutate: updateTask, error } =
        trpc.boardTaskRouter.update.useMutation({
            onSuccess: (task) => {
                // also update board in cache to prevent refetching when navigating back to it
                const column = columns[task.columnId];
                utils.setData({ id: column.boardId }, (board) => {
                    if (!board) return;
                    return {
                        ...board,
                        columns: board.columns.map((col) => {
                            if (col.id === column.id) {
                                return {
                                    ...col,
                                    tasks: col.tasks.map((t) =>
                                        t.id === task.id ? task : t
                                    ),
                                };
                            }
                            return col;
                        }),
                    };
                });
            },
        });
    return { updateTask, error };
};

export default useUpdateTask;
