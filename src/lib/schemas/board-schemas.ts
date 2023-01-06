import { z } from 'zod';

export const boardCeationSchema = z.object({
    title: z
        .string()
        .min(2, 'The title should contain more than 1 character')
        .max(30, 'The title cannot contain more than 30 characters'),
    isFavourite: z.boolean(),
    columns: z
        .array(
            z.object({
                title: z
                    .string()
                    .min(
                        1,
                        'The column title should contain at least 1 character'
                    )
                    .max(
                        25,
                        'The column title cannot contain more than 25 characters'
                    ),
                position: z.number(),
            })
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
