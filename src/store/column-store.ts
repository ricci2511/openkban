import { BoardColumn } from '@prisma/client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Columns = {
    [boardId: string]: BoardColumn[];
};

type ColumnStore = {
    columns: Columns;
    setColumns: (columns: Columns) => void;
    addColumn: (column: BoardColumn) => void;
    removeColumn: (columnId: string, boardId: string) => void;
    updateColumn: (column: BoardColumn) => void;
};

const useColumnStore = create(
    immer<ColumnStore>((set) => ({
        columns: {},
        setColumns: (columns) =>
            set((state) => {
                state.columns = columns;
            }),
        addColumn: (column) =>
            set((state) => {
                if (!state.columns[column.boardId]) {
                    state.columns[column.boardId] = [];
                }
                state.columns[column.boardId].push(column);
            }),
        removeColumn: (columnId, boardId) =>
            set((state) => {
                state.columns[boardId] = state.columns[boardId].filter(
                    (column) => column.id !== columnId
                );
            }),
        updateColumn: (column) =>
            set((state) => {
                const index = state.columns[column.boardId].findIndex(
                    (c) => c.id === column.id
                );
                if (index !== -1) {
                    state.columns[column.boardId][index] = column;
                }
            }),
    }))
);

export default useColumnStore;
