import { BoardUpdate } from '@lib/schemas/board-schemas';
import { Board } from '@prisma/client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type BoardStore = {
    boards: Board[];
    setBoards: (boards: Board[]) => void;
    currentBoardId: string | undefined;
    addBoard: (board: Board) => void;
    removeBoard: (boardId: string) => void;
    updateBoard: (board: BoardUpdate) => void;
    setCurrentBoardId: (id: string) => void;
};

const useBoardStore = create(
    immer<BoardStore>((set, get) => ({
        boards: [],
        currentBoardId: undefined,
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
                const index = state.boards.findIndex((b) => b.id === board.id);
                if (index !== -1) {
                    // since BoardUpdate is a partial of Board, we need to spread the existing board first
                    state.boards[index] = { ...get().boards[index], ...board };
                }
            }),
        setCurrentBoardId: (id) => set((state) => (state.currentBoardId = id)),
    }))
);

export default useBoardStore;
