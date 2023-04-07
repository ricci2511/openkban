import { trpc } from '@lib/trpc';

/**
 * @description mutation for the current user to leave a board
 */
const useLeaveBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;

    const deleteBoardUserMutation = trpc.boardUserRouter.delete.useMutation({
        onSuccess: async ({ boardId }) => {
            // delete board from user's board list on client (tanstack query cache)
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) return prevBoards;
                return prevBoards.filter((board) => board.id !== boardId);
            });
        },
    });

    return deleteBoardUserMutation;
};

export default useLeaveBoard;
