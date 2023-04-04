import { boardSubtaskCreationSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { createError } from '@server/routers/common-errors';

export const createSubtask = authedProcedure
    .input(boardSubtaskCreationSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const subtask = await ctx.prisma.boardSubtask.create({
                data: {
                    title: input.title,
                    isDone: false,
                    task: {
                        connect: {
                            id: input.taskId,
                        },
                    },
                },
            });

            return subtask;
        } catch (error) {
            throw internalServerError(createError('subtask'), error);
        }
    });
