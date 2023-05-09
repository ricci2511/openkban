import { trpc } from '@lib/trpc';
import produce from 'immer';
import { useBoardUserActions, useBoardUsers } from 'store/kanban-store';

export const useCreateBoardUsers = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;
    const { addBoardUsers } = useBoardUserActions();

    const createBoardUserMutation =
        trpc.boardUserRouter.createUsers.useMutation({
            onSuccess: async (boardUsers) => {
                if (utils.getData()) {
                    // invalidate boards query cache if it exists
                    utils.invalidate();
                }

                addBoardUsers(boardUsers);
                successCb?.();
            },
        });

    return createBoardUserMutation;
};

export const useDeleteBoardUser = () => {
    const allBoardsUtils = trpc.useContext().boardRouter.getAll;
    const boardByIdUtils = trpc.useContext().boardRouter.getById;

    const deleteBoardUserMutation = trpc.boardUserRouter.delete.useMutation({
        onSuccess: async (boardUser) => {
            // invalidate kanban board data
            boardByIdUtils.invalidate({ id: boardUser.boardId });

            // return early if cached dashboard board list doesn't exist
            if (!allBoardsUtils.getData()) return;
            // update cached dashboard board list by removing the deleted board user
            allBoardsUtils.setData(undefined, (prevBoards) =>
                produce(prevBoards, (draft) => {
                    if (!draft || !prevBoards) return prevBoards;
                    const boardIndex = draft.findIndex(
                        (board) => board.id === boardUser.boardId
                    );
                    if (boardIndex === -1) return prevBoards;
                    const filteredBoardUsers = draft[
                        boardIndex
                    ].boardUser.filter((bu) => bu.id !== boardUser.id);
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
export const useUpdateBoardUser = (successCb?: () => void) => {
    const utils = trpc.useContext().boardRouter.getAll;

    const { updateBoardUser, setBoardUsers } = useBoardUserActions();
    const boardUsers = useBoardUsers();

    const updateBoardUserMutation = trpc.boardUserRouter.update.useMutation({
        onMutate: async (boardUser) => {
            // store old board users in case of error
            const oldBoardUsers = boardUsers;

            // update board user in kanban store
            updateBoardUser({ id: boardUser.boardUserId, ...boardUser });
            successCb?.();

            return oldBoardUsers;
        },
        onError: (err, boardUser, oldBoardUsers) => {
            // on error revert to previous board users
            oldBoardUsers ? setBoardUsers(oldBoardUsers) : undefined;
        },
        // update cached dashboard board list with new board user if it exists
        onSuccess: (boardUser) => {
            if (!utils.getData()) return;
            utils.setData(undefined, (prevBoards) =>
                produce(prevBoards, (draft) => {
                    if (!draft || !prevBoards) return prevBoards;
                    const boardIndex = draft.findIndex(
                        (board) => board.id === boardUser.boardId
                    );
                    if (boardIndex === -1) return prevBoards;
                    const boardUserIndex = draft[
                        boardIndex
                    ].boardUser.findIndex((bu) => bu.id === boardUser.id);
                    if (boardUserIndex === -1) return prevBoards;
                    const oldBoardUser =
                        draft[boardIndex].boardUser[boardUserIndex];
                    draft[boardIndex].boardUser[boardUserIndex] = {
                        ...oldBoardUser,
                        ...boardUser,
                    };
                })
            );
        },
    });

    return updateBoardUserMutation;
};
export type UpdateBoardUserMutation = ReturnType<typeof useUpdateBoardUser>;
