import { boardColumnCreationSchema } from '@lib/schemas/board-schemas';
import { authedProcedure } from '@server/routers/auth-router';
import { internalServerError } from '@server/helpers/error-helpers';
import { createError } from '@server/routers/common-errors';

export const createColumn = authedProcedure
    .input(boardColumnCreationSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const createColumn = await ctx.prisma.boardColumn.create({
                data: {
                    title: input.title,
                    color: input.color,
                    tasks: {
                        create: [],
                    },
                    board: {
                        connect: {
                            id: input.boardId,
                        },
                    },
                },
            });
            return createColumn;
        } catch (error) {
            throw internalServerError(createError('column'), error);
        }
    });
