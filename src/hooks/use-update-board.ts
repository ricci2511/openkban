import { trpc } from '@lib/trpc';
import { useBoardActions, useBoards } from 'store/board-store';

/**
 * @returns update board trpc mutation object
 */
const useUpdateBoard = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { updateBoard } = useBoardActions();
    const boards = useBoards();

    const updateBoardMutation = trpc.boardRouter.update.useMutation({
        // optimistic update
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
