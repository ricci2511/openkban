import { z } from 'zod';

export const boardCeationSchema = z.object({
    title: z
        .string()
        .min(2, 'The title should contain more than 1 character')
        .max(30, 'The title cannot contain more than 30 characters'),
    isFavourite: z.boolean(),
});
export type BoardCreation = z.infer<typeof boardCeationSchema>;

// Boards can currently be sorted by createdAt, title and lastInteractedAt props
const sortableBoardSchema = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    desc: z.boolean().default(false).optional(),
});
export type SortableBoard = z.infer<typeof sortableBoardSchema>;
