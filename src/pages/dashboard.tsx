import React from 'react';
import { MainLayout } from '@components/layouts/main-layout';
import { Dashboard } from '@components/dashboard';

const DashboardPage = () => {
    // TODO: SEO
    return (
        <MainLayout>
            <Dashboard />
        </MainLayout>
    );
};

export default DashboardPage;
