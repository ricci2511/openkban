import Head from 'next/head';
import 'styles/index.css';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { Toaster } from 'react-hot-toast';

/**
 * Persistent layout between page changes.
 * https://nextjs.org/docs/basic-features/layouts#with-typescript
 */
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>OpenKBan</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <ThemeProvider>
                <SessionProvider session={session}>
                    {getLayout(<Component {...pageProps} />)}
                </SessionProvider>
            </ThemeProvider>
            <Toaster />
        </>
    );
};

export default trpc.withTRPC(App);
