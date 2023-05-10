import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { queryError } from '@server/routers/common-errors';
import { ClientColumn } from 'types/board-types';
import { z } from 'zod';

export const getAllColumns = authedProcedure
    .input(z.object({ boardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
        try {
            const columns = await ctx.prisma.boardColumn.findMany({
                where: {
                    boardId: input.boardId,
                },
            });

            return columns as ClientColumn[];
        } catch (error) {
            const message = queryError('column', false);
            throw internalServerError(message, error);
        }
    });
