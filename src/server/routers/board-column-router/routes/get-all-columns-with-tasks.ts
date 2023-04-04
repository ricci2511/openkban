import { authedProcedure } from '@server/routers/auth-router';
import { internalServerError } from '@server/helpers/error-helpers';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { queryError } from '@server/routers/common-errors';

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
        const message = queryError('column', false);
        throw internalServerError(message, error);
    }
};

export const getAllColumnsWithTasks = authedProcedure
    .input(z.object({ boardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
        return await queryColumnsWithTasks(ctx.prisma, input.boardId);
    });
