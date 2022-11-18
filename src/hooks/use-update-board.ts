import { trpc } from '@lib/trpc';
import React from 'react';

const useUpdateBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: updateBoard, error } = trpc.boardRouter.update.useMutation({
        onMutate: async (boardToUpdate) => {
            utils.cancel();
            const previousBoards = utils.getData();
            const newBoards = previousBoards?.map((board) => {
                if (board.id === boardToUpdate.id) {
                    board.title = boardToUpdate.title;
                }
                return board;
            });
            utils.setData(newBoards);
            return { previousBoards };
        },
        onError: (err, boardToUpdate, context) => {
            utils.setData(context?.previousBoards);
        },
        onSettled: () => {
            utils.invalidate();
        },
    });

    return { updateBoard, error };
};

export default useUpdateBoard;
