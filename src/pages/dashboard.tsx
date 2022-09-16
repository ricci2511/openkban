import MainLayout from '@components/layouts/main-layout';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { GetServerSidePropsContext } from 'next/types';

const Dashboard = () => {
    return (
        <MainLayout>
            <>My dashboard</>
        </MainLayout>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

export default Dashboard;
