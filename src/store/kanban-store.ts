import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import { BoardTask } from '@prisma/client';
import { BoardColumnWithTasks } from 'types/board-types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ColumnTasks = {
    [columnId: string]: BoardColumnWithTasks;
};

const initColumnTasks = (columns: BoardColumnWithTasks[]) => {
    return columns.reduce(
        (acc: { [columnId: string]: BoardColumnWithTasks }, cur) => {
            acc[cur.id] = cur;
            // sort tasks by rank
            acc[cur.id].tasks.sort(sortByLexoRankAsc);
            return acc;
        },
        {}
    );
};

type KanbanStore = {
    columnTasks: ColumnTasks;
    setColumnTasks: (columnTasks: ColumnTasks) => void;
    initColumnTasks: (columns: BoardColumnWithTasks[]) => void;
    addColumn: (column: BoardColumnWithTasks) => void;
    updateColumnColor: (id: string, color: string) => void;
    addTask: (task: BoardTask) => void;
    deleteTask: (task: BoardTask) => void;
};

const useKanbanStore = create(
    immer<KanbanStore>((set) => ({
        columnTasks: {},
        setColumnTasks: (columnTasks: ColumnTasks) =>
            set((state) => {
                state.columnTasks = columnTasks;
            }),
        initColumnTasks: (columns: BoardColumnWithTasks[]) =>
            set((state) => {
                state.columnTasks = initColumnTasks(columns);
            }),
        addColumn: (column: BoardColumnWithTasks) =>
            set((state) => {
                state.columnTasks[column.id] = column;
            }),
        updateColumnColor: (id: string, color: string) =>
            set((state) => {
                state.columnTasks[id].color = color;
            }),
        addTask: (task: BoardTask) =>
            set((state) => {
                state.columnTasks[task.columnId].tasks.push(task);
            }),
        deleteTask: (task: BoardTask) =>
            set((state) => {
                state.columnTasks[task.columnId].tasks = state.columnTasks[
                    task.columnId
                ].tasks.filter((t) => t.id !== task.id);
            }),
    }))
);

export default useKanbanStore;
