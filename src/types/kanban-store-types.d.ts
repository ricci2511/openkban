import { Permission, Role } from '@prisma/client';
import {
    BoardData,
    ClientBoardUser,
    ClientColumn,
    ClientSubtask,
    ClientTask,
    PermissionMap,
    TasksMap,
} from './board-types';

export type ColumnsActions = {
    setColumns: (columns: ClientColumn[]) => void;
    addColumn: (column: ClientColumn) => void;
    deleteColumn: (columnId: string) => void;
    updateColumn: (column: ClientColumn) => void;
};

export type TasksActions = {
    setTasks: (tasks: TasksMap) => void;
    setCurrentTask: (task: ClientTask) => void;
    addTask: (task: ClientTask) => void;
    removeTask: (taskId: string, columnId: string) => void;
    updateTask: (task: ClientTask) => void;
    dropTaskInColumn: (
        columnId: string,
        tasks: ClientTask[],
        oldTaskIndex: number,
        newTaskIndex: number
    ) => void;
};

export type SubtasksActions = {
    setSubtasks: (subtasks: ClientSubtask[]) => void;
    addSubtask: (subtask: ClientSubtask) => void;
    removeSubtask: (subtaskId: string) => void;
    updateSubtask: (subtask: ClientSubtask) => void;
};

export type BoardUserActions = {
    setBoardUsers: (users: ClientBoardUser[]) => void;
    addBoardUsers: (user: ClientBoardUser[]) => void;
    removeBoardUser: (userId: string) => void;
    updateBoardUser: (user: PartialExcept<ClientBoardUser, 'id'>) => void;
};

export type KanbanStore = {
    init: (boardData: BoardData, currRole: Role) => void;
    boardId: string;
    columns: ClientColumn[];
    tasks: TasksMap;
    // it might be more efficient to just store the reference with a tuple to avoid task
    // data duplication, e.g. [columnId, taskIndex], but i encountered race condition problems
    currentTask: ClientTask | undefined;
    // only the subtasks of the current task in use are stored here
    subtasks: ClientSubtask[];
    boardUsers: ClientBoardUser[];
    // the role of the current user
    role: Role;
    setRole: (role: BoardUserRole) => void;
    // the permissions applied to all users with the MEMBER role
    membersPermissions: PermissionMap | undefined;
    updateMembersPermission: (permission: Permission, access: boolean) => void;
    columnsActions: ColumnsActions;
    tasksActions: TasksActions;
    subtasksActions: SubtasksActions;
    boardUserActions: BoardUserActions;
};
