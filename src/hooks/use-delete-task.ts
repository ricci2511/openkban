import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

/**
 * @returns deleteTask function, isLoading state, error state
 */
const useDeleteTask = () => {
    const utils = trpc.useContext().boardRouter.getById;
    const removeTask = useKanbanStore((state) => state.deleteTask);
    const columns = useKanbanStore((state) => state.columnTasks);

    const {
        mutate: deleteTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.delete.useMutation({
        onSuccess: (task) => {
            // after successful deletion remove task from kanban store
            removeTask(task);
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
                                tasks: col.tasks.filter(
                                    (t) => t.id !== task.id
                                ),
                            };
                        }
                        return col;
                    }),
                };
            });
        },
    });
    return { deleteTask, isLoading, error };
};

export default useDeleteTask;
