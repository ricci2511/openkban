import { Header } from '@components/header';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';

export const SignInLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Head>
                <title>Sign in</title>
                <meta
                    name="description"
                    content="Sign in to your OpenKBan account"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="mt-32">{children}</main>
        </>
    );
};
