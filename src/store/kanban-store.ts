import { BoardTask } from '@prisma/client';
import { BoardColumnWithTasks } from 'types/board-types';
import { create } from 'zustand';

export type ColumnTasks = {
    [columnId: string]: BoardColumnWithTasks;
};

const initColumnTasks = (columns: BoardColumnWithTasks[]) => {
    return columns.reduce(
        (acc: { [columnId: string]: BoardColumnWithTasks }, cur) => {
            acc[cur.id] = cur;
            return acc;
        },
        {}
    );
};

const addTask = (task: BoardTask, columns: ColumnTasks) => {
    const columnId = task.columnId;
    return {
        ...columns,
        [columnId]: {
            ...columns[columnId],
            tasks: [...columns[columnId].tasks, task],
        },
    };
};

const deleteTask = (task: BoardTask, columns: ColumnTasks) => {
    const columnId = task.columnId;
    return {
        ...columns,
        [columnId]: {
            ...columns[columnId],
            tasks: columns[columnId].tasks.filter((t) => t.id !== task.id),
        },
    };
};

type KanbanStore = {
    columnTasks: ColumnTasks;
    setColumnTasks: (columnTasks: ColumnTasks) => void;
    initColumnTasks: (columns: BoardColumnWithTasks[]) => void;
    addColumn: (column: BoardColumnWithTasks) => void;
    addTask: (task: BoardTask) => void;
    deleteTask: (task: BoardTask) => void;
};

const useKanbanStore = create<KanbanStore>(
    (set): KanbanStore => ({
        columnTasks: {},
        setColumnTasks: (columnTasks: ColumnTasks) =>
            set((state) => ({
                ...state,
                columnTasks,
            })),
        initColumnTasks: (columns: BoardColumnWithTasks[]) =>
            set((state) => ({
                ...state,
                columnTasks: initColumnTasks(columns),
            })),
        addColumn: (column: BoardColumnWithTasks) =>
            set((state) => ({
                ...state,
                columnTasks: {
                    ...state.columnTasks,
                    [column.id]: column,
                },
            })),
        addTask: (task: BoardTask) =>
            set((state) => ({
                ...state,
                columnTasks: addTask(task, state.columnTasks),
            })),
        deleteTask: (task: BoardTask) =>
            set((state) => ({
                ...state,
                columnTasks: deleteTask(task, state.columnTasks),
            })),
    })
);

export default useKanbanStore;
