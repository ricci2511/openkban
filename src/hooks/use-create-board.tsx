import { trpc } from '@lib/trpc';
import React from 'react';

const useCreateBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: createBoard, error } = trpc.boardRouter.create.useMutation({
        onSuccess: (newBoard) => {
            utils.setData((oldBoards) => [...(oldBoards || []), newBoard]);
        },
    });
    return { createBoard, error };
};

export default useCreateBoard;
