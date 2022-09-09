import CustomHeader from '@components/UI/Header';
import { Container } from '@mantine/core';
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
            <CustomHeader />
            <Container size="xs">{children}</Container>
        </>
    );
};

export default AuthLayout;
