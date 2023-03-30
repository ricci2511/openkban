import { arrayMove } from '@dnd-kit/sortable';
import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import { BoardTask, BoardColumn } from '@prisma/client';
import { BoardColumnWithTasks } from 'types/board-types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TasksMap = {
    [columnId: string]: BoardTask[];
};

type ColumnsActions = {
    setColumns: (columns: BoardColumn[]) => void;
    addColumn: (column: BoardColumn) => void;
    deleteColumn: (columnId: string) => void;
    updateColumn: (column: BoardColumn) => void;
};

type TasksActions = {
    setTasks: (tasks: TasksMap) => void;
    addTask: (task: BoardTask) => void;
    removeTask: (taskId: string, columnId: string) => void;
    updateTask: (task: BoardTask) => void;
    getTaskById: (id: string) => BoardTask | undefined;
    dropTaskInColumn: (
        columnId: string,
        tasks: BoardTask[],
        oldTaskIndex: number,
        newTaskIndex: number
    ) => void;
};

type KanbanStore = {
    boardId: string;
    columns: BoardColumn[];
    tasks: TasksMap;
    init: (columnsWithTasks: BoardColumnWithTasks[]) => void;
    columnsActions: ColumnsActions;
    tasksActions: TasksActions;
};

const useKanbanStore = create(
    immer<KanbanStore>((set, get) => ({
        boardId: '',
        columns: [],
        tasks: {},
        init: (columnsWithTasks) =>
            set((state) => {
                state.columns = columnsWithTasks.map(
                    ({ tasks, ...col }) => col
                );
                state.tasks = columnsWithTasks.reduce((acc: TasksMap, cur) => {
                    acc[cur.id] = [...cur.tasks].sort(sortByLexoRankAsc);
                    return acc;
                }, {});
                state.boardId = columnsWithTasks[0].boardId;
            }),
        columnsActions: {
            setColumns: (columns) =>
                set((state) => {
                    state.columns = columns;
                }),
            addColumn: (column) =>
                set((state) => {
                    state.columns.push(column);
                    state.tasks[column.id] = [];
                }),
            deleteColumn: (columnId) =>
                set((state) => {
                    state.columns = state.columns.filter(
                        (col) => col.id !== columnId
                    );
                    delete state.tasks[columnId];
                }),
            updateColumn: (column) =>
                set((state) => {
                    const index = state.columns.findIndex(
                        (col) => col.id === column.id
                    );
                    if (index === -1) return;
                    state.columns[index] = column;
                }),
        },
        tasksActions: {
            setTasks: (tasks) =>
                set((state) => {
                    state.tasks = tasks;
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
                    if (index === -1) return;
                    state.tasks[task.columnId][index] = task;
                }),
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
 * @returns method to initialize the kanban store with the given columns and tasks
 */
export const useInitKanbanStore = () => useKanbanStore((state) => state.init);

/**
 * @returns boardId of the current kanban board
 */
export const useBoardId = () => useKanbanStore((state) => state.boardId);

/**
 * @returns all columns that are in the kanban store
 */
export const useColumns = () => useKanbanStore((state) => state.columns);

/**
 * @returns all tasks that are in the kanban store
 */
export const useTasks = () => useKanbanStore((state) => state.tasks);

/**
 * All actions can be accessed with one selector while avoiding unnecessary rerenders.
 * See: https://tkdodo.eu/blog/working-with-zustand#separate-actions-from-state
 * @returns object with all actions that can be performed on the columns
 */
export const useColumnsActions = () =>
    useKanbanStore((state) => state.columnsActions);

/**
 * @returns object with all actions that can be performed on the tasks
 */
export const useTasksActions = () =>
    useKanbanStore((state) => state.tasksActions);
