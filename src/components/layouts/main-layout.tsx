import CustomHeader from '@components/UI/Header';
import Sidebar from '@components/UI/Sidebar';
import { AppShell } from '@mantine/core';
import React from 'react';

interface MainLayoutProps {
    children: JSX.Element;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <AppShell padding="md" navbar={<Sidebar />} header={<CustomHeader />}>
            {children}
        </AppShell>
    );
};

export default MainLayout;
