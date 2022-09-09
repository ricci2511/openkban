import { z } from 'zod';

/**
 * @category Auth
 */
export const INVALID_USERNAME = 'Username should be at least 3 characters long';
export const emailSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});
