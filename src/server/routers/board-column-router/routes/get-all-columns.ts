import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { queryError } from '@server/routers/common-errors';
import { z } from 'zod';

export const getAllColumns = authedProcedure
    .input(z.object({ boardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
        try {
            return await ctx.prisma.boardColumn.findMany({
                where: {
                    boardId: input.boardId,
                },
            });
        } catch (error) {
            const message = queryError('column', false);
            throw internalServerError(message, error);
        }
    });
