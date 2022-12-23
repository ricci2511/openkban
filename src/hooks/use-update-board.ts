import { trpc } from '@lib/trpc';

const useUpdateBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: updateBoard, error } = trpc.boardRouter.update.useMutation({
        onMutate: async (boardToUpdate) => {
            utils.cancel();
            const previousBoards = utils.getData();
            const { id, title, isFavourite, lastInteractedAt } = boardToUpdate;
            utils.setData(undefined, (oldBoards) =>
                (oldBoards || []).map((board) => {
                    if (board.id === id) {
                        board.title = title ?? board.title;
                        board.isFavourite = isFavourite ?? board.isFavourite;
                        board.lastInteractedAt =
                            lastInteractedAt ?? board.lastInteractedAt;
                    }
                    return board;
                })
            );
            return { previousBoards };
        },
        onError: (err, boardToUpdate, context) => {
            utils.setData(undefined, context?.previousBoards);
        },
        onSettled: () => {
            utils.invalidate();
        },
    });

    return { updateBoard, error };
};

export default useUpdateBoard;
