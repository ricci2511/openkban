import { TRPCError } from '@trpc/server';

export const internalServerError = (message: string, cause?: unknown) => {
    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message,
        cause,
    });
};

export const notFound = (message: string) => {
    throw new TRPCError({
        code: 'NOT_FOUND',
        message,
    });
};

export const unauthorized = (message: string) => {
    throw new TRPCError({
        code: 'UNAUTHORIZED',
        message,
    });
};

export const forbidden = (message: string) => {
    throw new TRPCError({
        code: 'FORBIDDEN',
        message,
    });
};
