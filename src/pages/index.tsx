import CenteredLoadingSpinner from '@components/UI/other/centered-loading-spinner';
import useAuthRouting from '@hooks/use-auth-routing';
import type { NextPage } from 'next';

const Home: NextPage = () => {
    const { status } = useAuthRouting();
    if (status) return <CenteredLoadingSpinner />;

    return <></>;
};

export default Home;
