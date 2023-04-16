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

// map of columnId to tasks
export type TasksMap = Record<string, BoardTask[]>;

export type ClientBoardUser = {
    role: BoardUserRole;
    isFavourite: boolean;
    userId: string;
    user: Omit<User, 'id' | 'emailVerified'>;
};

export type BoardWithUsers = Board & {
    boardUser: ClientBoardUser[];
};

export type UnnormalizedBoardData = BoardWithUsers & {
    columns: BoardColumnWithTasks[];
};

export type BoardData = BoardWithUsers & {
    columns: BoardColumn[];
    tasks: TasksMap;
};
