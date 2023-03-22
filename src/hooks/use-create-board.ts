import { trpc } from '@lib/trpc';

/**
 * @param successCb callback to run after successful board creation
 * @returns createBoard trpc mutation object
 */
const useCreateBoard = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;

    const createBoardMutation = trpc.boardRouter.create.useMutation({
        onSuccess: (newBoard) => {
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) return prevBoards;
                return [...prevBoards, newBoard];
            });
            successCb?.();
        },
    });
    return createBoardMutation;
};

export default useCreateBoard;
