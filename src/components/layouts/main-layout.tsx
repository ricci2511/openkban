import CustomHeader from '@components/UI/Header';
import { AppShell, Header, Navbar } from '@mantine/core';
import React from 'react';

interface MainLayoutProps {
    children: JSX.Element;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <AppShell
            padding="md"
            navbar={
                <Navbar width={{ base: 300 }} height="100%" p="xs">
                    {/* Navbar content */}
                </Navbar>
            }
            header={<CustomHeader />}
        >
            {children}
        </AppShell>
    );
};

export default MainLayout;
