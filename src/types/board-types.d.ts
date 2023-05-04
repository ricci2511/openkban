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
} from '@prisma/client';

export type BoardColumnsLayout = 'default' | 'custom';
// the board to be updated wont include userId or createdAt since those props dont change
export type BoardToUpdate = Partial<Omit<Board, 'userId' | 'createdAt'>> & {
    id: string;
};

export type BoardColumnWithTasks = BoardColumn & {
    tasks: BoardTask[];
};

export type TaskWithSubTasks = BoardTask & {
    subtasks: BoardSubtask[];
};

// map of columnId to tasks
export type TasksMap = Record<string, BoardTask[]>;

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
    columns: BoardColumnWithTasks[];
    memberPermissions?: BoardPermission[];
};

export type BoardData = Board & {
    columns: BoardColumn[];
    tasks: TasksMap;
    boardUsers: ClientBoardUser[];
    // the permissions applied to all board users with the role of member
    // others are not relevant, a VIEWER has no permissions, an ADMIN has all permissions
    // this prop is omitted if the current user is a VIEWER
    membersPermissions?: Permission[];
};

export type KanbanEntity = 'COLUMN' | 'TASK' | 'SUBTASK';
export type KanbanAction = 'CREATE' | 'UPDATE' | 'DELETE';
