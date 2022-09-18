import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const useAuthRouting = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const signInRoute = '/auth/signin';

    useEffect(() => {
        if (
            !session &&
            status === 'unauthenticated' &&
            router.pathname !== signInRoute
        ) {
            router.replace(signInRoute);
        }
        if (
            session &&
            status === 'authenticated' &&
            router.pathname === signInRoute
        ) {
            router.replace('/dashboard');
        }
    }, [session, router, status]);

    return { status };
};

export default useAuthRouting;
