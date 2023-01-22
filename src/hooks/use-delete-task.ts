import { trpc } from '@lib/trpc';

/**
 * @param boardId id of the board to delete the task from
 * @returns deleteTask function, isLoading state, error state
 */
const useDeleteTask = (boardId: string) => {
    const utils = trpc.useContext().boardRouter.getById;
    const {
        mutate: deleteTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.delete.useMutation({
        onSuccess: (task) => {
            utils.setData({ id: boardId }, (board) => {
                if (!board) return;
                return {
                    ...board,
                    columns: board.columns.map((column) => {
                        if (column.id === task.columnId) {
                            return {
                                ...column,
                                tasks: column.tasks.filter(
                                    (t) => t.id !== task.id
                                ),
                            };
                        }
                        return column;
                    }),
                };
            });
        },
    });
    return { deleteTask, isLoading, error };
};

export default useDeleteTask;
