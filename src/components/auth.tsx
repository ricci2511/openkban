import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import CustomLoadingSpinner from './ui/other/custom-loading-spinner';

const Auth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.replace('/auth/signin');
        },
    });

    if (status === 'loading') return <CustomLoadingSpinner centered />;

    return <>{children}</>;
};

export default Auth;
