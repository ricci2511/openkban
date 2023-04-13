import { internalServerError } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { t } from '@server/trpc';
import { z } from 'zod';
import { queryError } from '../common-errors';

export const userRouter = t.router({
    searchUsers: authedRateLimitedProcedure
        .input(z.object({ nameOrEmail: z.string().or(z.string().email()) }))
        .query(async ({ ctx, input }) => {
            const isEmail = z
                .string()
                .email()
                .safeParse(input.nameOrEmail).success;

            try {
                // depending on the input format search for users by name or email
                const users = await ctx.prisma.user.findMany({
                    where: {
                        [isEmail ? 'email' : 'name']: {
                            contains: input.nameOrEmail,
                        },
                    },
                    take: 8,
                });

                return users;
            } catch (error) {
                const message = queryError('user', false);
                throw internalServerError(message, error);
            }
        }),
});
