import { internalServerError } from '@server/helpers/error-helpers';
import { COLUMNS_TASKS_QUERY_ERROR } from '../errors';
import { authedProcedure } from '@server/routers/auth-router';
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
            throw internalServerError(COLUMNS_TASKS_QUERY_ERROR, error);
        }
    });
