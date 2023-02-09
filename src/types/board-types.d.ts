import { Board, BoardColumn, BoardTask } from '@prisma/client';

export type BoardColumnsLayout = 'default' | 'custom';
// the board to be updated wont include userId or createdAt since those props dont change
export type BoardToUpdate = Partial<Omit<Board, 'userId' | 'createdAt'>> & {
    id: string;
};

export type BoardColumnWithTasks = BoardColumn & {
    tasks: BoardTask[];
};

export type BoardData = Board & {
    columns: BoardColumnWithTasks[];
};
