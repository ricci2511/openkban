import Head from 'next/head';
import 'styles/index.css';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '@server/router';
import { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import AbstractedMantineProvider from '@components/abstracted-mantine-provider';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';

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

            <AbstractedMantineProvider>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </AbstractedMantineProvider>
        </>
    );
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        const url = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}/api/trpc`
            : 'http://localhost:3000/api/trpc';
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
    ssr: false,
})(App);
