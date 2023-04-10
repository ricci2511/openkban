import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { LoadingSpinner } from './ui/loading-spinner';

export const Auth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.replace('/auth/signin');
        },
    });

    if (status === 'loading') return <LoadingSpinner centered />;

    return <>{children}</>;
};
