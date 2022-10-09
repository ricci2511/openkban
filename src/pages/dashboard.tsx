import MainLayout from '@components/layouts/main-layout';
import React from 'react';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <MainLayout>
            <>
                <h1 className="text-xl font-semibold">
                    {session?.user ? `${session.user.name}'s` : `Your`}{' '}
                    dashboard
                </h1>
            </>
        </MainLayout>
    );
};

Dashboard.auth = true;
export default Dashboard;
