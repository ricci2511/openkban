import AuthLayout from '@components/layouts/auth-layout';
import { Button, Divider, Group, Paper, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useSession, signIn, signOut, getProviders } from 'next-auth/react';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { emailSchema } from '@lib/constants';

const SignIn = ({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [authType, toggleAuthType] = useToggle(['noEmail', 'email']);
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: zodResolver(emailSchema),
    });

    const { data: session } = useSession();

    const providerButtons = Object.values(providers || []).map((provider) => (
        <Button
            key={provider.name}
            variant="default"
            fullWidth
            onClick={() => signIn(provider.id)}
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

    return (
        <AuthLayout>
            {session ? (
                <div>
                    Logged in as
                    <Button variant="default" onClick={() => signOut()}>
                        Sign out bro
                    </Button>
                </div>
            ) : (
                <Paper radius="md" p="xl" withBorder>
                    <Text size="lg" weight={500}>
                        Welcome to OpenKBan, sign in with
                    </Text>
                    <Group mb="md" mt="md">
                        {providerButtons.length > 0 ? (
                            providerButtons
                        ) : (
                            <Text component="p" size="md">
                                Authentication providers failed to load :(
                            </Text>
                        )}
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
            )}
        </AuthLayout>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignIn;
