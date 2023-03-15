import { BoardColumn, BoardTask } from '@prisma/client';
import { BoardColumnWithTasks } from 'types/board-types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { arrayMove } from '@dnd-kit/sortable';
import { sortByLexoRankAsc } from '@lib/lexorank-helpers';

export type ColumnsMap = {
    [boardId: string]: BoardColumn[];
};

export type TasksMap = {
    [columnId: string]: BoardTask[];
};

export type ColumnsTasksMap = ColumnsMap & TasksMap;

type ColumnsActions = {
    setColumns: (columns: ColumnsMap) => void;
    addColumn: (column: BoardColumn) => void;
    removeColumn: (columnId: string, boardId: string) => void;
    updateColumn: (column: BoardColumn) => void;
};

type TasksActions = {
    setTasks: (tasks: TasksMap) => void;
    addTask: (task: BoardTask) => void;
    removeTask: (taskId: string, columnId: string) => void;
    updateTask: (task: BoardTask) => void;
    getTasksOfBoard: (boardId: string) => TasksMap;
    getTaskById: (id: string) => BoardTask | undefined;
    dropTaskInColumn: (
        columnId: string,
        tasks: BoardTask[],
        oldTaskIndex: number,
        newTaskIndex: number
    ) => void;
};

type ColumnTasksStore = {
    columns: ColumnsMap;
    tasks: TasksMap;
    columnsActions: ColumnsActions;
    tasksActions: TasksActions;
    init: (columnsWithTasks: BoardColumnWithTasks[]) => void;
};

const initColumnsMap = (
    columnsWithTasks: BoardColumnWithTasks[],
    columnsMap: ColumnsMap
) => {
    return columnsWithTasks.reduce((acc: ColumnsMap, cur) => {
        if (!acc[cur.boardId]) {
            acc[cur.boardId] = [];
        }
        const { tasks, ...column } = cur;
        acc[column.boardId].push(column);
        return { ...columnsMap, ...acc };
    }, {});
};

const initTasksMap = (
    columnsWithTasks: BoardColumnWithTasks[],
    tasksMap: TasksMap
) => {
    return columnsWithTasks.reduce((acc: TasksMap, cur) => {
        // sort tasks by rank
        acc[cur.id] = [...cur.tasks].sort(sortByLexoRankAsc);
        return { ...tasksMap, ...acc };
    }, {});
};

const useColumnsTasksStore = create(
    immer<ColumnTasksStore>((set, get) => ({
        columns: {},
        tasks: {},
        init: (columnsWithTasks) =>
            set((state) => {
                state.columns = initColumnsMap(columnsWithTasks, get().columns);
                state.tasks = initTasksMap(columnsWithTasks, get().tasks);
            }),
        columnsActions: {
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
                    state.tasks[column.id] = [];
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
        },
        tasksActions: {
            setTasks: (tasks) =>
                set((state) => {
                    state.tasks = { ...get().tasks, ...tasks };
                }),
            addTask: (task) =>
                set((state) => {
                    if (!state.tasks[task.columnId]) {
                        state.tasks[task.columnId] = [];
                    }
                    state.tasks[task.columnId].push(task);
                }),
            removeTask: (taskId, columnId) =>
                set((state) => {
                    state.tasks[columnId] = state.tasks[columnId].filter(
                        (task) => task.id !== taskId
                    );
                }),
            updateTask: (task) =>
                set((state) => {
                    const index = state.tasks[task.columnId].findIndex(
                        (t) => t.id === task.id
                    );
                    if (index !== -1) {
                        state.tasks[task.columnId][index] = task;
                    }
                }),
            getTasksOfBoard: (boardId) => {
                const columns = get().columns[boardId];
                if (!columns) {
                    return {};
                }
                return columns.reduce((acc: TasksMap, cur) => {
                    acc[cur.id] = get().tasks[cur.id];
                    return acc;
                }, {});
            },
            getTaskById: (id: string) => {
                const tasks = Object.values(get().tasks).flat();
                return tasks.find((t) => t.id === id);
            },
            dropTaskInColumn: (columnId, tasks, oldTaskIndex, newTaskIndex) =>
                set((state) => {
                    state.tasks[columnId] = arrayMove(
                        tasks,
                        oldTaskIndex,
                        newTaskIndex
                    );
                }),
        },
    }))
);

/**
 * This function should be called once after having fetched the required data when navigating to a specific board.
 * @returns init function of the ColumnsTasksStore
 */
export const useInitColumnsTasksStore = () =>
    useColumnsTasksStore((state) => state.init);

// column related hooks
/**
 * @returns all columns that are in the ColumnsTasksStore
 */
export const useAllColumns = () =>
    useColumnsTasksStore((state) => state.columns);
/**
 * @param boardId
 * @returns array of columns belonging to a board
 */
export const useColumns = (boardId: string) =>
    useColumnsTasksStore((state) => state.columns[boardId]);
/**
 * @returns object containing all actions related to columns
 */
export const useColumnsActions = () =>
    useColumnsTasksStore((state) => state.columnsActions);

// task related hooks
/**
 * @returns all tasks that are in the ColumnsTasksStore
 */
export const useAllTasks = () => useColumnsTasksStore((state) => state.tasks);
/**
 * @param columnId
 * @returns array of tasks belonging to a column
 */
export const useTasks = (columnId: string) =>
    useColumnsTasksStore((state) => state.tasks[columnId]);
/**
 * @param boardId
 * @returns all tasks belonging to a board
 */
export const useBoardTasks = (boardId: string) =>
    useColumnsTasksStore((state) =>
        state.tasksActions.getTasksOfBoard(boardId)
    );
/**
 * @returns object containing all actions related to tasks
 */
export const useTasksActions = () =>
    useColumnsTasksStore((state) => state.tasksActions);
