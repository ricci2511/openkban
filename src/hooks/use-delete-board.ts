import { trpc } from '@lib/trpc';
import { useBoardActions } from 'store/board-store';

/**
 * @returns delete task trpc mutation object
 */
const useDeleteBoard = () => {
    const { removeBoard } = useBoardActions();

    const deleteBoardMutation = trpc.boardRouter.delete.useMutation({
        onSuccess: async ({ id }) => {
            removeBoard(id);
        },
    });

    return deleteBoardMutation;
};

export default useDeleteBoard;
