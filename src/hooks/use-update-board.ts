import { trpc } from '@lib/trpc';
import useBoardStore from 'store/board-store';

/**
 * @returns updateBoard function, error state
 */
const useUpdateBoard = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;
    const updateBoard = useBoardStore((state) => state.updateBoard);
    const boards = useBoardStore((state) => state.boards);

    const updateBoardMutation = trpc.boardRouter.update.useMutation({
        onMutate: async (boardToUpdate) => {
            utils.cancel();
            updateBoard(boardToUpdate);
            successCb?.();
            // store the previous board in case the mutation fails
            return boards.find((b) => b.id === boardToUpdate.id);
        },
        onError: (err, boardToUpdate, oldBoard) => {
            updateBoard(oldBoard!);
        },
    });

    return updateBoardMutation;
};

export default useUpdateBoard;
