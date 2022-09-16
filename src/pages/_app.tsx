import Head from 'next/head';
import 'styles/index.css';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '@server/router';
import { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { SSRContext } from '@lib/trpc';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <>
            <Head>
                <title>OpenKBan</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    );
};

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '';
    }

    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        const url = `${getBaseUrl()}/api/trpc`;
        return {
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({ url }),
            ],
            url,
            transformer: superjson,
        };
    },
    ssr: true,
    /**
     * Set headers or status code when doing SSR
     */
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
        // For app caching with SSR see https://trpc.io/docs/caching
        return {};
    },
})(App);
