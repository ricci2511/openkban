import { trpc } from '@lib/trpc';
import produce from 'immer';

// TODO: create board user mutation

export const useDeleteBoardUser = () => {
    const utils = trpc.useContext().boardRouter.getAll;

    const deleteBoardUserMutation = trpc.boardUserRouter.delete.useMutation({
        onSuccess: async (boardUser) => {
            utils.setData(undefined, (prevBoards) =>
                produce(prevBoards, (draft) => {
                    if (!draft || !prevBoards) return prevBoards;
                    const boardIndex = draft.findIndex(
                        (board) => board.id === boardUser.boardId
                    );
                    if (boardIndex === -1) return prevBoards;
                    const filteredBoardUsers = draft[
                        boardIndex
                    ].boardUser.filter((bu) => bu.userId !== boardUser.userId);
                    draft[boardIndex].boardUser = filteredBoardUsers;
                })
            );
        },
    });

    return deleteBoardUserMutation;
};
export type DeleteBoardUserMutation = ReturnType<typeof useDeleteBoardUser>;

/**
 * @description mutation to leave a board
 */
export const useLeaveBoard = () => {
    const utils = trpc.useContext().boardRouter.getAll;

    const leaveBoardMutation = trpc.boardUserRouter.leaveBoard.useMutation({
        onSuccess: async ({ boardId }) => {
            // delete board from user's board list on client (tanstack query cache)
            utils.setData(undefined, (prevBoards) => {
                if (!prevBoards) return prevBoards;
                return prevBoards.filter((board) => board.id !== boardId);
            });
        },
    });

    return leaveBoardMutation;
};
export type LeaveBoardMutation = ReturnType<typeof useLeaveBoard>;

/**
 * @description mutation to update a board user (e.g. change role or favourite status)
 * @param userId id of the user to update
 * @param successCb callback to run after successful board user update
 */
export const useUpdateBoardUser = (userId: string, successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;

    const updateBoardUserMutation = trpc.boardUserRouter.update.useMutation({
        // optimistic update
        onMutate: async (boardUser) => {
            utils.cancel();
            // store old board users in case mutation fails
            const oldBoards = utils.getData();
            utils.setData(undefined, (prevBoards) =>
                produce(prevBoards, (draft) => {
                    if (!draft || !prevBoards) return prevBoards;
                    const boardIndex = draft.findIndex(
                        (board) => board.id === boardUser.boardId
                    );
                    if (boardIndex === -1) return prevBoards;
                    const boardUserIndex = draft[
                        boardIndex
                    ].boardUser.findIndex((user) => user.userId === userId);
                    if (boardUserIndex === -1) return prevBoards;
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
export type UpdateBoardUserMutation = ReturnType<typeof useUpdateBoardUser>;
