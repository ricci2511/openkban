import {
    ActionIcon,
    Container,
    createStyles,
    Header,
    Title,
    useMantineColorScheme,
} from '@mantine/core';
import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

const CustomHeader = () => {
    const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <Header height={60} py="xs" px="xl" mb={100}>
            <div className={classes.inner}>
                <Title order={1} size="h2">
                    OpenKBan
                </Title>
                <ActionIcon
                    variant="filled"
                    color={dark ? 'yellow' : 'indigo'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle Color Scheme"
                >
                    {dark ? <HiSun size={18} /> : <HiMoon size={18} />}
                </ActionIcon>
            </div>
        </Header>
    );
};

export default CustomHeader;
