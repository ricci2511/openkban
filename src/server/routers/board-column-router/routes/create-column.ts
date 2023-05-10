import { boardColumnCreationSchema } from '@lib/schemas/board-schemas';
import { authedProcedure } from '@server/routers/auth-router';
import { internalServerError } from '@server/helpers/error-helpers';
import { createError } from '@server/routers/common-errors';
import { queryBoardUserProperty } from '@server/routers/board-user-router/routes/get-board-user';
import { ClientColumn } from 'types/board-types';

export const createColumn = authedProcedure
    .input(boardColumnCreationSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const boardUserId = await queryBoardUserProperty(
                ctx.session.user.id,
                input.boardId,
                'id',
                ctx.prisma
            );

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
                    owner: {
                        connect: {
                            id: boardUserId,
                        },
                    },
                },
            });
            return createColumn as ClientColumn;
        } catch (error) {
            console.error('CREATE COLUMN ERROR: ', error);
            throw internalServerError(createError('column'), error);
        }
    });
