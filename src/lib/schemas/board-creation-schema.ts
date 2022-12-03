import { z } from 'zod';

export const boardCeationSchema = z.object({
    title: z
        .string()
        .min(2, 'The title should contain more than 1 character')
        .max(30, 'The title cannot contain more than 30 characters'),
    isFavourite: z.boolean(),
});

export type BoardFormSchemaType = z.infer<typeof boardCeationSchema>;
