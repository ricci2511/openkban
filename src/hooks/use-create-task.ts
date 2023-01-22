import { trpc } from '@lib/trpc';

/**
 * @param boardId id of the board to add the task to
 * @param successCb callback to run after successful task creation
 * @returns createTask function, isLoading state, error state
 */
const useCreateTask = (boardId: string, successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getById;
    const {
        mutate: createTask,
        isLoading,
        error,
    } = trpc.boardTaskRouter.create.useMutation({
        onSuccess: (task) => {
            utils.setData({ id: boardId }, (board) => {
                if (!board) return;
                return {
                    ...board,
                    columns: board.columns.map((column) => {
                        if (column.id === task.columnId) {
                            return {
                                ...column,
                                tasks: [...column.tasks, task],
                            };
                        }
                        return column;
                    }),
                };
            });
            successCb?.();
        },
    });
    return { createTask, isLoading, error };
};

export default useCreateTask;
