import Head from 'next/head';
import 'styles/index.css';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import { ThemeProvider } from 'next-themes';
import Auth from '@components/auth';
import { AppProps } from 'next/app';

interface AppPropsWithAuth extends AppProps {
    Component: AppProps['Component'] & { auth: boolean };
}

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
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
                    {Component.auth ? (
                        <Auth>
                            <Component {...pageProps} />
                        </Auth>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </SessionProvider>
            </ThemeProvider>
        </>
    );
};

export default trpc.withTRPC(App);
