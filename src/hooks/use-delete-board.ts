import { trpc } from '@lib/trpc';

/**
 * @returns delete task trpc mutation object
 */
const useDeleteBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;

    const deleteBoardMutation = trpc.boardRouter.delete.useMutation({
        onSuccess: async ({ id }) => {
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) return prevBoards;
                return prevBoards.filter((board) => board.id !== id);
            });
        },
    });

    return deleteBoardMutation;
};

export default useDeleteBoard;
