import { trpc } from '@lib/trpc';

/**
 * @param successCb callback to run after successful board creation
 * @returns createBoard function, isLoading state, error state
 */
const useCreateBoard = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;
    const {
        mutate: createBoard,
        isLoading,
        error,
    } = trpc.boardRouter.create.useMutation({
        onSuccess: (newBoard) => {
            utils.setData(undefined, (oldBoards) => [
                newBoard,
                ...(oldBoards || []),
            ]);
            successCb !== undefined ? successCb() : null;
        },
    });
    return { createBoard, isLoading, error };
};

export default useCreateBoard;
