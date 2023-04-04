import { arrayMove } from '@dnd-kit/sortable';
import { BoardTask, BoardColumn, BoardSubtask } from '@prisma/client';
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
    setCurrentTask: (task: BoardTask) => void;
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

type SubtasksActions = {
    setSubtasks: (subtasks: BoardSubtask[]) => void;
    addSubtask: (subtask: BoardSubtask) => void;
    removeSubtask: (subtaskId: string) => void;
    updateSubtask: (subtask: BoardSubtask) => void;
};

type KanbanStore = {
    boardId: string;
    columns: BoardColumn[];
    tasks: TasksMap;
    currentTask: BoardTask | undefined;
    // only the subtasks of the current task in use are stored here
    subtasks: BoardSubtask[];
    init: (columnsWithTasks: BoardColumnWithTasks[]) => void;
    columnsActions: ColumnsActions;
    tasksActions: TasksActions;
    subtasksActions: SubtasksActions;
};

const useKanbanStore = create(
    immer<KanbanStore>((set, get) => ({
        boardId: '',
        columns: [],
        tasks: {},
        currentTask: undefined,
        subtasks: [],
        init: (columnsWithTasks) =>
            set((state) => {
                state.columns = columnsWithTasks.map(
                    ({ tasks, ...col }) => col
                );
                state.tasks = columnsWithTasks.reduce((acc: TasksMap, cur) => {
                    acc[cur.id] = [...cur.tasks];
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
            setCurrentTask: (task) =>
                set((state) => {
                    state.currentTask = task;
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
                    // update current task if it's the same as the updated task
                    if (state.currentTask && state.currentTask.id === task.id) {
                        state.currentTask = task;
                    }

                    if (!state.tasks[task.columnId]) return;
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
        subtasksActions: {
            setSubtasks: (subtasks) =>
                set((state) => {
                    state.subtasks = subtasks;
                }),
            addSubtask: (subtask) =>
                set((state) => {
                    !state.subtasks
                        ? (state.subtasks = [subtask])
                        : state.subtasks.push(subtask);
                }),
            removeSubtask: (subtaskId) =>
                set((state) => {
                    state.subtasks = state.subtasks.filter(
                        (st) => st.id !== subtaskId
                    );
                }),
            updateSubtask: (subtask) =>
                set((state) => {
                    const index = state.subtasks.findIndex(
                        (st) => st.id === subtask.id
                    );
                    if (index === -1) return;
                    state.subtasks[index] = subtask;
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
 * @returns the current task that the user is working on
 */
export const useCurrentTask = () =>
    useKanbanStore((state) => state.currentTask);

/**
 * @returns all subtasks that are in the kanban store
 */
export const useSubtasks = () => useKanbanStore((state) => state.subtasks);

/**
 * All actions can be accessed with one selector while avoiding unnecessary rerenders.
 * @see: https://tkdodo.eu/blog/working-with-zustand#separate-actions-from-state
 * @returns object with all actions that can be performed on the columns
 */
export const useColumnsActions = () =>
    useKanbanStore((state) => state.columnsActions);

/**
 * @returns object with all actions that can be performed on the tasks
 */
export const useTasksActions = () =>
    useKanbanStore((state) => state.tasksActions);

/**
 * @returns object with all actions that can be performed on the subtasks
 */
export const useSubtasksActions = () =>
    useKanbanStore((state) => state.subtasksActions);
