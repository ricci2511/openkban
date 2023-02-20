import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import { BoardColumn, BoardTask } from '@prisma/client';
import { BoardColumnWithTasks } from 'types/board-types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ColumnTasks = {
    [columnId: string]: BoardTask[];
};

const initColumnTasks = (columns: BoardColumnWithTasks[]) => {
    return columns.reduce((acc: ColumnTasks, cur) => {
        // sort tasks by rank
        acc[cur.id] = [...cur.tasks].sort(sortByLexoRankAsc);
        return acc;
    }, {});
};

const initColumns = (columns: BoardColumnWithTasks[]): BoardColumn[] => {
    return columns.map((column) => {
        const { tasks, ...columnWithoutTasks } = column;
        return columnWithoutTasks;
    });
};

type KanbanStore = {
    columns: BoardColumn[];
    tasks: ColumnTasks;
    boardId: string;
    init: (columns: BoardColumnWithTasks[]) => void;
    addColumn: (column: BoardColumn) => void;
    updateColor: (id: string, color: string) => void;
    setTasks: (tasks: ColumnTasks) => void;
    addTask: (task: BoardTask) => void;
    deleteTask: (task: BoardTask) => void;
};

const useKanbanStore = create(
    immer<KanbanStore>((set) => ({
        columns: [],
        tasks: {},
        boardId: '',
        init: (columns: BoardColumnWithTasks[]) =>
            set((state) => {
                state.columns = initColumns(columns);
                state.tasks = initColumnTasks(columns);
                state.boardId = columns[0].boardId;
            }),
        setTasks: (tasks: ColumnTasks) =>
            set((state) => {
                state.tasks = tasks;
            }),
        addColumn: (column: BoardColumn) =>
            set((state) => {
                state.columns.push(column);
                state.tasks[column.id] = [];
            }),
        updateColor: (id: string, color: string) =>
            set((state) => {
                const index = state.columns.findIndex((c) => c.id === id);
                state.columns[index].color = color;
            }),
        addTask: (task: BoardTask) =>
            set((state) => {
                state.tasks[task.columnId].push(task);
            }),
        deleteTask: (task: BoardTask) =>
            set((state) => {
                state.tasks[task.columnId] = state.tasks[task.columnId].filter(
                    (t) => t.id !== task.id
                );
            }),
    }))
);

export default useKanbanStore;
