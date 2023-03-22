import { trpc } from '@lib/trpc';

/**
 * @returns update board trpc mutation object
 */
const useUpdateBoard = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;

    const updateBoardMutation = trpc.boardRouter.update.useMutation({
        // optimistic update
        onMutate: async (boardToUpdate) => {
            utils.cancel();
            // store old boards in case mutation fails
            const oldBoards = utils.getData();
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) {
                    return prevBoards;
                }
                return prevBoards.map((prevBoard) =>
                    prevBoard.id === boardToUpdate.id
                        ? { ...prevBoard, ...boardToUpdate }
                        : prevBoard
                );
            });
            successCb?.();
            // return the previous boards in case the mutation fails
            return oldBoards;
        },
        onError: (err, boardToUpdate, oldBoards) => {
            // on error revert to previous boards
            utils.setData(undefined, oldBoards);
        },
    });

    return updateBoardMutation;
};

export default useUpdateBoard;
