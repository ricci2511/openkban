import { trpc } from '@lib/trpc';
import useBoardStore from 'store/board-store';

/**
 * @returns deleteTask mutation object
 */
const useDeleteBoard = () => {
    const removeBoard = useBoardStore((state) => state.removeBoard);

    const deleteBoardMutation = trpc.boardRouter.delete.useMutation({
        onSuccess: async ({ id }) => {
            removeBoard(id);
        },
    });

    return deleteBoardMutation;
};

export default useDeleteBoard;
