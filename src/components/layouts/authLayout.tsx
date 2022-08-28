import {
    ActionIcon,
    Container,
    createStyles,
    Header,
    Title,
    useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import React from 'react';

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

type AuthLayoutProps = {
    children: JSX.Element;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <>
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
            {children}
        </>
    );
};

export default AuthLayout;
