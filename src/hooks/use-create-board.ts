import { trpc } from '@lib/trpc';
import { useBoardActions } from 'store/board-store';

/**
 * @param successCb callback to run after successful board creation
 * @returns createBoard trpc mutation object
 */
const useCreateBoard = (successCb?: () => void) => {
    const { addBoard } = useBoardActions();

    const createBoardMutation = trpc.boardRouter.create.useMutation({
        onSuccess: (newBoard) => {
            addBoard(newBoard);
            successCb?.();
        },
    });
    return createBoardMutation;
};

export default useCreateBoard;
