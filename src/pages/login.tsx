import AuthLayout from '@components/layouts/authLayout';
import AuthProviderButton from '@components/UI/Buttons/authProviderButton';
import {
    EMAIL_REGEX,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    INVALID_USERNAME,
    PASSWORD_REGEX,
} from '@lib/constants';
import {
    Anchor,
    Button,
    Divider,
    Group,
    Paper,
    PaperProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { NextPage } from 'next';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';

const Login: NextPage = (props: PaperProps) => {
    const [authType, toggleAuthType] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            userName: '',
            password: '',
        },
        validate: {
            email: (val) => (EMAIL_REGEX.test(val) ? null : INVALID_EMAIL),
            userName: (val) => (val.length >= 3 ? null : INVALID_USERNAME),
            password: (val) =>
                PASSWORD_REGEX.test(val) ? null : INVALID_PASSWORD,
        },
    });

    const siteTitle = authType === 'login' ? 'Login' : 'Register';

    return (
        <AuthLayout siteTitle={siteTitle}>
            <Paper radius="md" p="xl" withBorder {...props}>
                <Text size="lg" weight={500}>
                    Welcome to OpenKBan, {authType} with
                </Text>
                <Group grow mb="md" mt="md">
                    <AuthProviderButton
                        buttonText="Google"
                        icon={<FcGoogle size={18} />}
                    />
                    <AuthProviderButton
                        buttonText="Github"
                        icon={<SiGithub size={18} />}
                    />
                </Group>
                <Divider
                    label="Prefer email? No problem"
                    labelPosition="center"
                    my="xl"
                />
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <Stack>
                        {authType === 'register' && (
                            <TextInput
                                label="Username"
                                placeholder="Your desired username"
                                {...form.getInputProps('userName')}
                            />
                        )}
                        <TextInput
                            type="email"
                            label="Email"
                            placeholder="janedoe@email.com"
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your desired password"
                            {...form.getInputProps('password')}
                        />
                        <Anchor
                            component="button"
                            type="button"
                            color="indigo"
                            onClick={() => toggleAuthType()}
                            size="xs"
                            align="left"
                        >
                            {authType === 'register'
                                ? 'Have an account? Login now'
                                : 'No account yet? Register now'}
                        </Anchor>
                        <Button type="submit" color="indigo">
                            {upperFirst(authType)}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </AuthLayout>
    );
};

export default Login;
