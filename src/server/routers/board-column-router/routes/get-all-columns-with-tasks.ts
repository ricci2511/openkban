import { authedProcedure } from '@server/routers/auth-router';
import { COLUMNS_TASKS_QUERY_ERROR } from '../errors';
import { internalServerError } from '@server/helpers/error-helpers';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

export const queryColumnsWithTasks = async (
    prisma: PrismaClient,
    boardId: string
) => {
    try {
        return await prisma.boardColumn.findMany({
            where: {
                boardId,
            },
            include: {
                tasks: true,
            },
        });
    } catch (error) {
        throw internalServerError(COLUMNS_TASKS_QUERY_ERROR, error);
    }
};

export const getAllColumnsWithTasks = authedProcedure
    .input(z.object({ boardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
        return await queryColumnsWithTasks(ctx.prisma, input.boardId);
    });
