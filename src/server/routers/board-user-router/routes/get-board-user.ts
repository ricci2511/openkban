import { BoardUser, PrismaClient } from '@prisma/client';
import { internalServerError, notFound } from '@server/helpers/error-helpers';
import { authedRateLimitedProcedure } from '@server/middlewares';
import { queryError } from '@server/routers/common-errors';
import { z } from 'zod';

export const queryBoardUserProperty = async <TProp extends keyof BoardUser>(
    userId: string,
    boardId: string,
    property: TProp,
    prisma: PrismaClient
): Promise<BoardUser[TProp]> => {
    try {
        const boardUser = await prisma.boardUser.findFirst({
            where: {
                userId,
                boardId,
            },
            select: {
                [property]: true,
            },
        });

        if (!boardUser) return notFound('Board user not found.');

        if (!boardUser[property])
            return notFound(`Board user ${property} not found.`);

        return boardUser[property];
    } catch (error) {
        throw internalServerError(
            `Error while querying board user ${property}.`,
            error
        );
    }
};

export const queryBoardUser = async (
    userId: string,
    boardId: string,
    prisma: PrismaClient
) => {
    try {
        const boardUser = await prisma.boardUser.findFirst({
            where: {
                userId,
                boardId,
            },
        });

        if (!boardUser) return notFound('Board user not found.');

        return boardUser;
    } catch (error) {
        const message = queryError('boardUser', true);
        throw internalServerError(message, error);
    }
};

const schema = z.object({
    boardId: z.string().cuid(),
    userId: z.string().cuid(),
    property: z
        .enum(['id', 'role', 'isFavourite', 'boardId', 'userId'])
        .optional(),
});

export const getBoardUser = authedRateLimitedProcedure
    .input(schema)
    .query(async ({ ctx, input }) => {
        const { boardId, userId, property } = input;

        if (property) {
            return await queryBoardUserProperty(
                userId,
                boardId,
                property,
                ctx.prisma
            );
        }

        return await queryBoardUser(userId, boardId, ctx.prisma);
    });
