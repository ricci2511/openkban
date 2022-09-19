import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Protect routes on the client side
const useAuthRouting = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const signInRoute = '/auth/signin';

    useEffect(() => {
        if (status === 'unauthenticated' && router.pathname !== signInRoute) {
            router.replace(signInRoute);
        }
        if (
            status === 'authenticated' &&
            (router.pathname === signInRoute || router.pathname === '/')
        ) {
            router.replace('/dashboard');
        }
    }, [router, status]);

    return { session, status };
};

export default useAuthRouting;
