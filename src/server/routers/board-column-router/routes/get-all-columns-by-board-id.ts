import { PrismaClient } from '@prisma/client';
import { internalServerError } from '@server/helpers/error-helpers';
import { COLUMNS_TASKS_QUERY_ERROR } from '../errors';
import { authedProcedure } from '@server/routers/auth-router';
import { z } from 'zod';

export const queryColumnsByBoardId = async (
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

export const getAllColumnsByBoardId = authedProcedure
    .input(z.object({ boardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
        return await queryColumnsByBoardId(ctx.prisma, input.boardId);
    });
