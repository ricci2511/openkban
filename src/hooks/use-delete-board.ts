import { trpc } from '@lib/trpc';

/**
 * @returns deleteTask function, isLoading state, error state
 */
const useDeleteBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: deleteBoard, error } = trpc.boardRouter.delete.useMutation({
        onMutate: async (boardToDelete) => {
            await utils.cancel();
            const previousBoards = utils.getData();
            utils.setData(undefined, (oldBoards) =>
                (oldBoards || []).filter(
                    (board) => board.id !== boardToDelete.id
                )
            );
            return { previousBoards };
        },
        onError: (err, boardToDelete, context) => {
            utils.setData(undefined, context?.previousBoards);
        },
        onSettled: () => {
            utils.invalidate();
        },
    });

    return { deleteBoard, error };
};

export default useDeleteBoard;
