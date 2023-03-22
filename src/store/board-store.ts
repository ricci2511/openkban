import { BoardUpdate } from '@lib/schemas/board-schemas';
import { Board } from '@prisma/client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// TODO: This store will be removed in further commits as i will be using a combination of redis and tanstack query as the cache
type BoardStore = {
    boards: Board[];
    currentBoardId: string | undefined;
    boardById: (id: string) => Board | undefined;
    actions: {
        setBoards: (boards: Board[]) => void;
        addBoard: (board: Board) => void;
        removeBoard: (boardId: string) => void;
        updateBoard: (board: BoardUpdate) => void;
        setCurrentBoardId: (id: string) => void;
    };
};

const useBoardStore = create(
    immer<BoardStore>((set, get) => ({
        boards: [],
        currentBoardId: undefined,
        boardById: (id) => get().boards.find((board) => board.id === id),
        actions: {
            setBoards: (boards) =>
                set((state) => {
                    state.boards = boards;
                }),
            addBoard: (board) =>
                set((state) => {
                    state.boards.push(board);
                }),
            removeBoard: (boardId) =>
                set((state) => {
                    state.boards = state.boards.filter(
                        (board) => board.id !== boardId
                    );
                }),
            updateBoard: (board) =>
                set((state) => {
                    const index = state.boards.findIndex(
                        (b) => b.id === board.id
                    );
                    if (index !== -1) {
                        // since BoardUpdate is a partial of Board, we need to spread the existing board first
                        state.boards[index] = {
                            ...get().boards[index],
                            ...board,
                        };
                    }
                }),
            setCurrentBoardId: (id) =>
                set((state) => {
                    state.currentBoardId = id;
                }),
        },
    }))
);

/**
 * @returns all boards in the store
 */
export const useBoards = () => useBoardStore((state) => state.boards);
/**
 * @returns id of the current board that is being interacted with or undefined if no board is selected
 */
export const useBoardId = () => useBoardStore((state) => state.currentBoardId);
/**
 *
 * @param id
 * @returns board with the given id or undefined if no board with the given id exists
 */
export const useBoardById = (id: string) =>
    useBoardStore((state) => state.boardById(id));
/**
 * All actions can be accessed with one selector while avoiding unnecessary rerenders.
 * See: https://tkdodo.eu/blog/working-with-zustand#separate-actions-from-state
 * @returns object containing all actions related to boards
 */
export const useBoardActions = () => useBoardStore((state) => state.actions);
