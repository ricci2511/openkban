import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';
import { COLUMN_UPDATE_ERROR } from '../errors';

export const updateColumn = authedProcedure
    .input(
        z.object({
            id: z.string().cuid(),
            title: z.string().optional(),
            color: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const updateColumn = await ctx.prisma.boardColumn.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    color: input.color,
                },
            });
            return updateColumn;
        } catch (error) {
            throw internalServerError(COLUMN_UPDATE_ERROR, error);
        }
    });
