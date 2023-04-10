import { trpc } from '@lib/trpc';

/**
 * @param successCb callback to run after successful board creation
 * @returns createBoard trpc mutation object
 */
export const useCreateBoard = (successCb?: () => void) => {
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
export type CreateBoardMutation = ReturnType<typeof useCreateBoard>;

/**
 * @returns delete task trpc mutation object
 */
export const useDeleteBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;

    const deleteBoardMutation = trpc.boardRouter.delete.useMutation({
        onSuccess: async ({ id }) => {
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) return prevBoards;
                return prevBoards.filter((board) => board.id !== id);
            });
        },
    });

    return deleteBoardMutation;
};
export type DeleteBoardMutation = ReturnType<typeof useDeleteBoard>;

/**
 * @returns update board trpc mutation object
 */
export const useUpdateBoard = (successCb?: () => void) => {
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
export type UpdateBoardMutation = ReturnType<typeof useUpdateBoard>;
