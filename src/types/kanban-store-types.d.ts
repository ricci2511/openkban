import { BoardColumn, BoardSubtask, BoardTask } from '@prisma/client';
import { BoardColumnWithTasks, ClientBoardUser } from './board-types';

export type TasksMap = {
    [columnId: string]: BoardTask[];
};

export type ColumnsActions = {
    setColumns: (columns: BoardColumn[]) => void;
    addColumn: (column: BoardColumn) => void;
    deleteColumn: (columnId: string) => void;
    updateColumn: (column: BoardColumn) => void;
};

export type TasksActions = {
    setTasks: (tasks: TasksMap) => void;
    setCurrentTask: (task: BoardTask) => void;
    addTask: (task: BoardTask) => void;
    removeTask: (taskId: string, columnId: string) => void;
    updateTask: (task: BoardTask) => void;
    dropTaskInColumn: (
        columnId: string,
        tasks: BoardTask[],
        oldTaskIndex: number,
        newTaskIndex: number
    ) => void;
};

export type SubtasksActions = {
    setSubtasks: (subtasks: BoardSubtask[]) => void;
    addSubtask: (subtask: BoardSubtask) => void;
    removeSubtask: (subtaskId: string) => void;
    updateSubtask: (subtask: BoardSubtask) => void;
};

export type BoardUserActions = {
    setBoardUsers: (users: ClientBoardUser[]) => void;
    addBoardUser: (user: ClientBoardUser) => void;
    removeBoardUser: (userId: string) => void;
    updateBoardUser: (user: ClientBoardUser) => void;
};

export type KanbanStore = {
    boardId: string;
    columns: BoardColumn[];
    tasks: TasksMap;
    // it might be more efficient to just store the reference with a tuple to avoid task
    // data duplication, e.g. [columnId, taskIndex], but i encountered race condition problems
    currentTask: BoardTask | undefined;
    // only the subtasks of the current task in use are stored here
    subtasks: BoardSubtask[];
    boardUsers: ClientBoardUser[];
    // whether the current user is the admin of the board
    isAdmin: boolean;
    init: (
        columnsWithTasks: BoardColumnWithTasks[],
        boardUsers: ClientBoardUser[],
        isAdmin: boolean
    ) => void;
    columnsActions: ColumnsActions;
    tasksActions: TasksActions;
    subtasksActions: SubtasksActions;
    boardUserActions: BoardUserActions;
};
