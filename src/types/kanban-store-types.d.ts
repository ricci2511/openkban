import {
    BoardColumn,
    BoardSubtask,
    BoardTask,
    Permission,
    Role,
} from '@prisma/client';
import {
    BoardData,
    ClientBoardUser,
    PermissionMap,
    TasksMap,
} from './board-types';

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
    addBoardUsers: (user: ClientBoardUser[]) => void;
    removeBoardUser: (userId: string) => void;
    updateBoardUser: (user: Optional<ClientBoardUser, 'role' | 'user'>) => void;
};

export type KanbanStore = {
    init: (boardData: BoardData, currRole: Role) => void;
    boardId: string;
    columns: BoardColumn[];
    tasks: TasksMap;
    // it might be more efficient to just store the reference with a tuple to avoid task
    // data duplication, e.g. [columnId, taskIndex], but i encountered race condition problems
    currentTask: BoardTask | undefined;
    // only the subtasks of the current task in use are stored here
    subtasks: BoardSubtask[];
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
