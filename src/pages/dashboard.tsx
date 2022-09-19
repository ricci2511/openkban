import MainLayout from '@components/layouts/main-layout';
import React from 'react';
import useAuthRouting from '@hooks/use-auth-routing';
import CenteredLoadingSpinner from '@components/UI/other/centered-loading-spinner';
import { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Dashboard = () => {
    const { session, status } = useAuthRouting();
    if (status === 'loading' || status === 'unauthenticated')
        return <CenteredLoadingSpinner />;
    if (!session)
        return (
            <div className="mx-auto p-6">
                <p>Something unexpected happened...</p>
                <Link href="/auth/signin">
                    <a className="btn">Back to Sign in page</a>
                </Link>
            </div>
        );

    return (
        <MainLayout>
            <>
                <h1 className="text-xl font-semibold">
                    {session.user ? `${session.user.name}'s` : `Your`} dashboard
                </h1>
            </>
        </MainLayout>
    );
};

export default Dashboard;
