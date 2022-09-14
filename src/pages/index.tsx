import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Dashboard from './dashboard';

const Home: NextPage = () => {
    return (
        <>
            <Dashboard />
        </>
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
        props: {},
    };
};

export default Home;
