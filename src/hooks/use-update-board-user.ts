import { trpc } from '@lib/trpc';
import produce from 'immer';

const useUpdateBoardUser = (userId: string, successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;

    const updateBoardUserMutation = trpc.boardUserRouter.update.useMutation({
        // optimistic update
        onMutate: async (boardUser) => {
            utils.cancel();
            // store old board users in case mutation fails
            const oldBoards = utils.getData();
            utils.setData(undefined, (prevBoards) =>
                produce(prevBoards, (draft) => {
                    if (!draft || !prevBoards) return;
                    const boardIndex = draft.findIndex(
                        (board) => board.id === boardUser.boardId
                    );
                    if (boardIndex === -1) return;
                    const boardUserIndex = draft[
                        boardIndex
                    ].boardUser.findIndex((user) => user.userId === userId);
                    if (boardUserIndex === -1) return;
                    const oldBoardUser =
                        draft[boardIndex].boardUser[boardUserIndex];
                    draft[boardIndex].boardUser[boardUserIndex] = {
                        ...oldBoardUser,
                        ...boardUser,
                    };
                })
            );
            successCb?.();
            // return the previous boards in case the mutation fails
            return oldBoards;
        },
        onError: (err, boardUser, oldBoards) => {
            // on error revert to previous board users
            utils.setData(undefined, oldBoards);
        },
    });

    return updateBoardUserMutation;
};

export default useUpdateBoardUser;
