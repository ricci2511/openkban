import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Dashboard from './dashboard';

const Home: NextPage = () => {
    return <></>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);
    return {
        redirect: {
            destination: session ? 'dashboard' : '/auth/signin',
            permanent: false,
        },
    };
};

export default Home;
