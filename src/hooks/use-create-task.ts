import { trpc } from '@lib/trpc';

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
                const column = board.columns.find(
                    (column) => column.id === task.columnId
                );
                if (!column) return board;
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
