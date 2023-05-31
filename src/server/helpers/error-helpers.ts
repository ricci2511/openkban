import { TRPCError } from '@trpc/server';

export const internalServerError = (message: string, cause?: unknown) => {
    return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message,
        cause,
    });
};

export const notFound = (message: string) => {
    return new TRPCError({
        code: 'NOT_FOUND',
        message,
    });
};

export const unauthorized = (message: string) => {
    return new TRPCError({
        code: 'UNAUTHORIZED',
        message,
    });
};

export const forbidden = (message: string) => {
    return new TRPCError({
        code: 'FORBIDDEN',
        message,
    });
};
