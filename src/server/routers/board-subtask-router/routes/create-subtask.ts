import { boardSubtaskCreationSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { authedProcedure } from '@server/routers/auth-router';
import { queryBoardUserProperty } from '@server/routers/board-user-router/routes/get-board-user';
import { createError } from '@server/routers/common-errors';
import { z } from 'zod';

export const createSubtask = authedProcedure
    .input(boardSubtaskCreationSchema.extend({ boardId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
        try {
            const boardUserId = await queryBoardUserProperty(
                ctx.session.user.id,
                input.boardId,
                'id',
                ctx.prisma
            );

            const subtask = await ctx.prisma.boardSubtask.create({
                data: {
                    title: input.title,
                    isDone: false,
                    task: {
                        connect: {
                            id: input.taskId,
                        },
                    },
                    owner: {
                        connect: {
                            id: boardUserId,
                        },
                    },
                },
            });

            return subtask;
        } catch (error) {
            throw internalServerError(createError('subtask'), error);
        }
    });
