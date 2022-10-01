import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@server/router';
import { NextPageContext } from 'next';

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
    /**
     * Set HTTP Status code
     * @usage
     * const utils = trpc.useContext();
     * if (utils.ssrContext) {
     *   utils.ssrContext.status = 404;
     * }
     */
    status?: number;
}

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '';
    }

    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({
                    /**
                     * If you want to use SSR, you need to use the server's full URL
                     * @link https://trpc.io/docs/ssr
                     **/
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
            /**
             * @link https://react-query-v3.tanstack.com/reference/QueryClient
             **/
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     **/
    ssr: true,
    responseMeta(opts) {
        const ctx = opts.ctx as SSRContext;

        if (ctx.status) {
            // If HTTP status set, propagate that
            return {
                status: ctx.status,
            };
        }

        const error = opts.clientErrors[0];
        if (error) {
            // Propagate http first error from API calls
            return {
                status: error.data?.httpStatus ?? 500,
            };
        }
        // cache full page for 1 day + revalidate once every second
        const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
        return {
            'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        };
    },
});
