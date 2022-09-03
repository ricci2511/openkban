import CustomHeader from '@components/UI/Header';
import { Container } from '@mantine/core';
import Head from 'next/head';
import React from 'react';

type AuthLayoutProps = {
    siteTitle: 'Login' | 'Register';
    children: JSX.Element;
};

const AuthLayout = ({ siteTitle, children }: AuthLayoutProps) => {
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta
                    name="description"
                    content={`${siteTitle} to your OpenKBan account`}
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CustomHeader />
            <Container size="xs">{children}</Container>
        </>
    );
};

export default AuthLayout;
