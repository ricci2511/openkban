import { trpc } from '@lib/trpc';
import React from 'react';

const useDeleteBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: deleteBoard, error } = trpc.boardRouter.delete.useMutation({
        onMutate: async (boardToDelete) => {
            await utils.cancel();
            const previousBoards = utils.getData();
            utils.setData((oldBoards) =>
                (oldBoards || []).filter(
                    (board) => board.id !== boardToDelete.id
                )
            );
            return { previousBoards };
        },
        onError: (err, boardToDelete, context) => {
            utils.setData(context?.previousBoards);
        },
        onSettled: () => {
            utils.invalidate();
        },
    });

    return { deleteBoard, error };
};

export default useDeleteBoard;
