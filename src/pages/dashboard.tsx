import MainLayout from '@components/layouts/main-layout';
import React from 'react';
import useAuthRouting from '@hooks/use-auth-routing';
import CenteredLoadingSpinner from '@components/UI/other/centered-loading-spinner';

const Dashboard = () => {
    const { status } = useAuthRouting();
    if (status === 'loading' || status === 'unauthenticated')
        return <CenteredLoadingSpinner />;

    return (
        <MainLayout>
            <>My dashboard</>
        </MainLayout>
    );
};

export default Dashboard;
