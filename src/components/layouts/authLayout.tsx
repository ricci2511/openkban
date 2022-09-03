import {
    ActionIcon,
    Container,
    createStyles,
    Header,
    Title,
    useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import Head from 'next/head';
import React from 'react';

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

type AuthLayoutProps = {
    siteTitle: 'Login' | 'Register';
    children: JSX.Element;
};

const AuthLayout = ({ siteTitle, children }: AuthLayoutProps) => {
    const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

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
            <Header height={60} p="xs" mb={100}>
                <Container>
                    <div className={classes.inner}>
                        <Title order={1} size="h2">
                            OpenKBan
                        </Title>
                        <ActionIcon
                            variant="filled"
                            color={dark ? 'yellow' : 'blue'}
                            onClick={() => toggleColorScheme()}
                            title="Toggle Color Scheme"
                        >
                            {dark ? (
                                <IconSun size={18} />
                            ) : (
                                <IconMoonStars size={18} />
                            )}
                        </ActionIcon>
                    </div>
                </Container>
            </Header>
            <Container size="xs">{children}</Container>
        </>
    );
};

export default AuthLayout;
