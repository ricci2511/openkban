import Head from 'next/head';
import 'styles/index.css';
import { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import { ThemeProvider } from 'next-themes';

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

            <ThemeProvider>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </ThemeProvider>
        </>
    );
};

export default trpc.withTRPC(App);
