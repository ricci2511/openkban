import {
    Board,
    BoardColumn,
    BoardTask,
    BoardSubtask,
    BoardUser,
    User,
    BoardUserRole,
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

export type BoardWithUsersRoles = Board & {
    boardUser: {
        role: BoardUserRole;
        user: Omit<User, 'emailVerified'>;
    }[];
};

export type BoardData = Board & {
    columns: BoardColumnWithTasks[];
    boardUser: BoardWithUsersRoles['boardUser'];
};
