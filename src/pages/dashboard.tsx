import MainLayout from '@components/layouts/main-layout';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { GetServerSidePropsContext } from 'next/types';

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <MainLayout>
            <>
                My dashboard
                {session && (
                    <div>
                        Logged in as {session.user?.name}
                        <button
                            className="btn btn-error"
                            onClick={() =>
                                signOut({ callbackUrl: '/auth/signin' })
                            }
                        >
                            Sign out bro
                        </button>
                    </div>
                )}
            </>
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
