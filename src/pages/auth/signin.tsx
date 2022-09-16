import AuthLayout from '@components/layouts/auth-layout';
import { GetServerSidePropsContext } from 'next';
import { signIn, getProviders } from 'next-auth/react';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { AuthProviders } from 'types/next-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailFormSchemaType, emailSchema } from '@lib/schemas/email-schema';

const SignIn = ({ providers }: AuthProviders) => {
    const [withEmail, setWithEmail] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailFormSchemaType>({
        resolver: zodResolver(emailSchema),
    });

    const onSubmit = handleSubmit((data) => console.log(data.email));

    const getProviderButtons = (providers: AuthProviders['providers']) => {
        const providersArr = Object.values(providers || []);
        if (!providersArr.length) {
            return (
                <p className="text-xl">
                    Authentication providers failed to load :(
                </p>
            );
        }

        return providersArr.map((provider) => (
            <button
                key={provider.id}
                className="btn w-full gap-2 sm:w-1/2"
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
                {provider.name === 'Google' ? (
                    <FcGoogle size={18} />
                ) : (
                    <SiGithub size={18} />
                )}
                {provider.name}
            </button>
        ));
    };

    const providerButtons = getProviderButtons(providers);

    return (
        <AuthLayout>
            <article className="card m-4 mx-auto mb-8 max-w-lg items-center bg-base-200 shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title mb-3">
                        Welcome to OpenKBan, sign in with
                    </h2>
                    <div className="flex w-full flex-col gap-2 self-center sm:flex-row">
                        {providerButtons}
                    </div>
                    <div className="divider mb-0.5">Prefer your own email?</div>
                    <button
                        className="btn mt-2 gap-2"
                        onClick={() => setWithEmail((prevState) => !prevState)}
                    >
                        <MdEmail size={18} />
                        Email
                    </button>
                    {withEmail && (
                        <form
                            className="form-control w-full max-w-xs"
                            onSubmit={onSubmit}
                        >
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="text"
                                placeholder="janedoe@email.com"
                                className={`${
                                    errors.email && 'input-error'
                                } input input-bordered w-full max-w-xs placeholder-gray-500 placeholder-opacity-50`}
                                {...register('email')}
                            />
                            <p className="mt-2 text-error">
                                {errors.email?.message}
                            </p>
                            <button className="btn btn-primary mt-4 max-w-max">
                                Send magic link
                            </button>
                        </form>
                    )}
                </div>
            </article>
        </AuthLayout>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: { providers: await getProviders() },
    };
};

export default SignIn;
