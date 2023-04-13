import { MAX_COLUMNS } from '@lib/constants';
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

export const subtaskTitle = z
    .string()
    .min(1, 'Subtask title cannot be empty')
    .max(50, 'Subtask title cannot contain more than 50 characters');

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
        .max(MAX_COLUMNS, `You cannot have more than ${MAX_COLUMNS} columns`),
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
    // TODO: fix this, currently a start date can be greater than a due date
    dueDate: z
        .date({
            required_error: 'A due date must be specified',
            invalid_type_error: 'The due date must be a valid date',
        })
        .min(new Date(), 'The due date must be in the future'),
});
export type BoardTaskCreation = z.infer<typeof boardTaskCreationSchema>;

export const boardSubtaskCreationSchema = z.object({
    taskId: z.string().cuid(),
    title: subtaskTitle,
});
export type BoardSubtaskCreation = z.infer<typeof boardSubtaskCreationSchema>;

// Boards can currently be sorted by createdAt, title and lastInteractedAt props
const sortableBoardSchema = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    order: z.enum(['asc', 'desc']),
});
export type SortableBoard = z.infer<typeof sortableBoardSchema>;

// Schema for updating a kanban board
export const boardUpdateSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(2).max(30).optional(),
    lastInteractedAt: z.date().optional(),
});
export type BoardUpdate = z.infer<typeof boardUpdateSchema>;
