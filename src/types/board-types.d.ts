import { colors } from '@lib/constants';
import { Board, BoardColumn, BoardTask } from '@prisma/client';

export type BoardColumnsLayout = 'default' | 'custom';
// the board to be updated wont include userId or createdAt since those props dont change
export type BoardToUpdate = Partial<Omit<Board, 'userId' | 'createdAt'>> & {
    id: string;
};

export type BoardColumnsColors = typeof colors[number];

export type BoardColumnWithTasks = Omit<BoardColumn, 'color'> & {
    color: BoardColumnsColors;
    tasks: BoardTask[];
};

export type BoardData = Board & {
    columns: BoardColumnWithTasks[];
};
