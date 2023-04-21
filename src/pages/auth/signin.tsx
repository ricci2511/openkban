import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AuthProviders } from 'types/next-auth';
import { useRouter } from 'next/router';
import { getServerProviders } from '@server/helpers/get-server-providers';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { SignInLayout } from '@components/layouts/signin-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Github } from 'lucide-react';

const SignIn = ({ providers }: AuthProviders) => {
    // redirect back to dashboard if user is already logged in
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === 'authenticated') router.replace('/dashboard');
    }, [status, router]);
    if (status === 'loading' || status === 'authenticated')
        return <LoadingSpinner centered />;

    const authProviders = Object.values(providers ?? []);

    return (
        <SignInLayout>
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Sign in with your google or github account to get
                        started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {Object.values(providers ?? []).map(({ id, name }) => (
                            <Button
                                key={id}
                                variant="outline"
                                onClick={() =>
                                    signIn(id, { callbackUrl: '/dashboard' })
                                }
                            >
                                {name === 'Google' ? (
                                    <FcGoogle className="mr-2 h-5 w-5" />
                                ) : (
                                    <Github className="mr-2 h-5 w-5" />
                                )}
                                <span>{name}</span>
                            </Button>
                        ))}
                        {!authProviders.length && (
                            <p className="text-xl">
                                Authentication providers failed to load :(
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </SignInLayout>
    );
};

export const getStaticProps = async () => {
    return {
        props: { providers: getServerProviders() },
    };
};

export default SignIn;
