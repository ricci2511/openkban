import Header from '@components/ui/Header';
import Head from 'next/head';
import React from 'react';

type AuthLayoutProps = {
    children: JSX.Element;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
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

export default AuthLayout;
