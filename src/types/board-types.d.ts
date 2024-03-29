import { ClientTask } from './board-types.d';
import {
    Board,
    BoardColumn,
    BoardTask,
    BoardSubtask,
    BoardUser,
    User,
    BoardUserRole,
    Role,
    Permission,
    BoardPermission,
    BoardTaskAssignee,
} from '@prisma/client';

export type BoardColumnsLayout = 'default' | 'custom';
// the board to be updated wont include userId or createdAt since those props dont change
export type BoardToUpdate = Partial<Omit<Board, 'userId' | 'createdAt'>> & {
    id: string;
};

// owner id is always included in the client
export type ClientColumn = NonNullableField<BoardColumn, 'ownerId'>;

export type ClientTask = NonNullableField<BoardTask, 'ownerId'> & {
    // each task has an array of assignees, represented by their board user id
    assignees: string[];
};

export type ClientSubtask = NonNullableField<BoardSubtask, 'ownerId'>;

export type ClientTaskWithSubTasks = ClientTask & {
    subtasks: ClientSubtask[];
};

// map of columnId to tasks
export type TasksMap = Record<string, ClientTask[]>;

export type ClientBoardUser = {
    id: string;
    role: Role;
    user: Omit<User, 'emailVerified'>;
    isFavourite?: boolean; // whether the user has favourited the board
};

export type BoardWithUsers = Board & {
    boardUser: ClientBoardUser[];
};

export type UnnormalizedBoardData = Board & {
    boardUser: ClientBoardUser[];
    // Columns hold array of tasks, and tasks hold array of task assignees
    columns: (BoardColumn & {
        tasks: (BoardTask & {
            asignees: BoardTaskAssignee[];
        })[];
    })[];
    memberPermissions?: BoardPermission[];
};

export type BoardData = Board & {
    columns: ClientColumn[];
    tasks: TasksMap;
    boardUsers: ClientBoardUser[];
    // the permissions applied to all board users with the role of member
    // others are not relevant, a VIEWER has no permissions, an ADMIN has all permissions
    // this prop is omitted if the current user is a VIEWER
    membersPermissions?: Permission[];
};

export type PermissionMap = Record<Permission, boolean>;

export type KanbanEntity = 'COLUMN' | 'TASK' | 'SUBTASK';
export type KanbanAction = 'CREATE' | 'UPDATE' | 'DELETE';
