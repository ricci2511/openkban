import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';
import { BoardToUpdate } from 'types/board-types';

const updateBoardProps = (
    currBoards: Board[] | undefined,
    boardToUpdate: BoardToUpdate
) => {
    return (currBoards || []).map((board) => {
        if (board.id === boardToUpdate.id) {
            return { ...board, ...boardToUpdate };
        }
        return board;
    });
};

/**
 * @returns updateBoard function, error state
 */
const useUpdateBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { mutate: updateBoard, error } = trpc.boardRouter.update.useMutation({
        onMutate: async (boardToUpdate) => {
            utils.cancel();
            const previousBoards = utils.getData();
            utils.setData(undefined, (currBoards) =>
                updateBoardProps(currBoards, boardToUpdate)
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
