import { z } from 'zod';

export const boardCeationSchema = z.object({
    title: z
        .string()
        .min(1, 'The board title cannot be empty')
        .max(30, 'The title cannot contain more than 30 characters'),
    isFavourite: z.boolean(),
    columnTitles: z
        .array(
            z
                .string()
                .min(1, 'The column title cannot be empty')
                .max(
                    25,
                    'The column title cannot contain more than 25 characters'
                )
        )
        .min(1, 'You must have at least 1 column')
        .max(6, 'You cannot have more than 6 columns'),
});
export type BoardCreation = z.infer<typeof boardCeationSchema>;

export const boardTaskCreationSchema = z.object({
    columnId: z.string().cuid('A column must be specified'),
    title: z
        .string()
        .min(1, 'The task title cannot be empty')
        .max(35, 'The title cannot contain more than 35 characters'),
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

export const boardColumnCreationSchema = z.object({
    boardId: z.string().cuid(),
    title: z
        .string()
        .min(1, 'The column title cannot be empty')
        .max(25, 'The column title cannot contain more than 25 characters'),
    color: z.string(),
});
export type BoardColumnCreation = z.infer<typeof boardColumnCreationSchema>;

// Boards can currently be sorted by createdAt, title and lastInteractedAt props
const sortableBoardSchema = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    desc: z.boolean().default(false).optional(),
});
export type SortableBoard = z.infer<typeof sortableBoardSchema>;
