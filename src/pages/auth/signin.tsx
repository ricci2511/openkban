import AuthLayout from '@components/layouts/auth-layout';
import { Button, Divider, Group, Paper, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { GetServerSidePropsContext } from 'next';
import { signIn, getProviders } from 'next-auth/react';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { emailSchema } from '@lib/constants';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { AuthProviders } from 'types/next-auth';

const SignIn = ({ providers }: AuthProviders) => {
    const [authType, toggleAuthType] = useToggle(['noEmail', 'email']);
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: zodResolver(emailSchema),
    });

    const getProviderButtons = (providers: AuthProviders['providers']) => {
        const providersArr = Object.values(providers || []);
        if (!providersArr.length) {
            return (
                <Text component="p" size="md">
                    Authentication providers failed to load :(
                </Text>
            );
        }

        return providersArr.map((provider) => (
            <Button
                key={provider.id}
                variant="default"
                fullWidth
                onClick={() =>
                    signIn(provider.id, { callbackUrl: '/dashboard' })
                }
                leftIcon={
                    provider.name === 'Google' ? (
                        <FcGoogle size={18} />
                    ) : (
                        <SiGithub size={18} />
                    )
                }
            >
                {provider.name}
            </Button>
        ));
    };

    const providerButtons = getProviderButtons(providers);

    return (
        <AuthLayout>
            <Paper radius="md" p="xl" withBorder>
                <Text size="lg" weight={500}>
                    Welcome to OpenKBan, sign in with
                </Text>
                <Group mb="md" mt="md">
                    {providerButtons}
                </Group>
                <Divider
                    label="Prefer your own email? We'll send you a magic link"
                    labelPosition="center"
                    my="xl"
                />
                <Button
                    variant="default"
                    fullWidth
                    leftIcon={<MdEmail size={18} />}
                    onClick={() => toggleAuthType()}
                >
                    Email
                </Button>
                {authType === 'email' && (
                    <form
                        onSubmit={form.onSubmit((values) =>
                            console.log(values)
                        )}
                    >
                        <TextInput
                            withAsterisk
                            type="email"
                            label="Email"
                            placeholder="janedoe@email.com"
                            {...form.getInputProps('email')}
                            my="lg"
                        />
                        <Button type="submit" color="indigo">
                            Send magic link
                        </Button>
                    </form>
                )}
            </Paper>
        </AuthLayout>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);
    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }

    return {
        props: { providers: await getProviders() },
    };
};

export default SignIn;
