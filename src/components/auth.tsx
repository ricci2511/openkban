import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import CenteredLoadingSpinner from './UI/other/centered-loading-spinner';

const Auth = ({ children }: { children: any }) => {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.replace('/auth/signin');
        },
    });

    if (status === 'loading') return <CenteredLoadingSpinner />;

    return children;
};

export default Auth;
