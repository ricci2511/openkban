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

// Boards can currently be sorted by createdAt, title and lastInteractedAt props
const sortableBoardSchema = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    desc: z.boolean().default(false).optional(),
});
export type SortableBoard = z.infer<typeof sortableBoardSchema>;
