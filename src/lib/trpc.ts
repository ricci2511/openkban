import { TRPCLink, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@server/routers';
import superjson from 'superjson';
import { observable } from '@trpc/server/observable';
import { toast } from 'react-hot-toast';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const customLink: TRPCLink<AppRouter> = () => {
    return ({ next, op }) => {
        return observable((observer) => {
            const unsubscribe = next(op).subscribe({
                // value we receive on success
                next(value) {
                    observer.next(value);
                },
                // value we receive on error
                error(err) {
                    observer.error(err);
                    // all error messages are toastified
                    toast.error(err.message);
                },
                complete() {
                    observer.complete();
                },
            });
            return unsubscribe;
        });
    };
};

export const trpc = createTRPCNext<AppRouter>({
    config() {
        return {
            transformer: superjson,
            links: [
                customLink,
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        };
    },
    ssr: false,
});

/**
 * @see: https://trpc.io/docs/server/infer-types#inference-helpers
 */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
