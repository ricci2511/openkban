import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';

/**
 * @param successCb callback to run after successful task creation
 * @returns createTask function, isLoading state, error state
 */
const useCreateTask = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getById;
    const addTask = useKanbanStore((state) => state.addTask);
    const columns = useKanbanStore((state) => state.columnTasks);

    const {
        mutate: createTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.create.useMutation({
        onSuccess: (task) => {
            // after successful creation add task to kanban store
            addTask(task);
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
                                tasks: [...col.tasks, task],
                            };
                        }
                        return col;
                    }),
                };
            });
            successCb?.();
        },
    });
    return { createTask, isLoading, error };
};

export default useCreateTask;
