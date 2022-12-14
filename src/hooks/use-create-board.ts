import { trpc } from '@lib/trpc';

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
