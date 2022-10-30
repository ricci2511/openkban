import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import CustomLoadingSpinner from './UI/other/custom-loading-spinner';

const Auth = ({ children }: { children: any }) => {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.replace('/auth/signin');
        },
    });

    if (status === 'loading') return <CustomLoadingSpinner centered />;

    return children;
};

export default Auth;
