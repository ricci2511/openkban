import { z } from 'zod';

export const boardTitle = z
    .string()
    .min(1, 'Board title cannot be empty')
    .max(30, 'Board title cannot contain more than 30 characters');

export const columnTitle = z
    .string()
    .min(1, 'Column title cannot be empty')
    .max(25, 'Column title cannot contain more than 25 characters');

export const taskTitle = z
    .string()
    .min(1, 'Task title cannot be empty')
    .max(35, 'Task title cannot contain more than 35 characters');

/**
 *
 * @param zodString zod string used to validate the title input field
 * @returns a zod schema that can be used to validate the input of title editing
 */
export const titleSchema = (zodString: z.ZodString) => {
    return z.object({ title: zodString });
};

export type TitleInput = { title: string };

// Schema for creating a new kanban board
export const boardCeationSchema = z.object({
    title: boardTitle,
    isFavourite: z.boolean(),
    columnTitles: z
        .array(columnTitle)
        .min(1, 'You must have at least 1 column')
        .max(6, 'You cannot have more than 6 columns'),
});
export type BoardCreation = z.infer<typeof boardCeationSchema>;

// Schema for creating a new kanban column
export const boardColumnCreationSchema = z.object({
    boardId: z.string().cuid(),
    title: columnTitle,
    color: z.string(),
});
export type BoardColumnCreation = z.infer<typeof boardColumnCreationSchema>;

// Schema for creating a new kanban task
export const boardTaskCreationSchema = z.object({
    columnId: z.string().cuid('A column must be specified'),
    title: taskTitle,
    description: z
        .string()
        .max(500, 'The description cannot contain more than 500 characters')
        .optional(),
    startDate: z
        .date({
            required_error: 'A start date must be specified',
            invalid_type_error: 'The start date must be a valid date',
        })
        .min(
            // current day is the minimum start date
            new Date(new Date().toLocaleDateString('en-US')),
            'The start date cannot be in the past'
        ),
    dueDate: z
        .date({
            required_error: 'A due date must be specified',
            invalid_type_error: 'The due date must be a valid date',
        })
        .min(new Date(), 'The due date must be in the future'),
});
export type BoardTaskCreation = z.infer<typeof boardTaskCreationSchema>;

// Boards can currently be sorted by createdAt, title and lastInteractedAt props
const sortableBoardSchema = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    desc: z.boolean().default(false).optional(),
});
export type SortableBoard = z.infer<typeof sortableBoardSchema>;
