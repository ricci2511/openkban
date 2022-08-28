import AuthLayout from '@components/layouts/authLayout';
import AuthProviderButton from '@components/UI/Buttons/authProviderButton';
import {
    EMAIL_REGEX,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    PASSWORD_REGEX,
} from '@lib/constants';
import { Divider, Group, Paper, PaperProps, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { NextPage } from 'next';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';

const Login: NextPage = (props: PaperProps) => {
    const [authType, toggleAuthType] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val) => (EMAIL_REGEX.test(val) ? null : INVALID_EMAIL),
            password: (val) =>
                PASSWORD_REGEX.test(val) ? null : INVALID_PASSWORD,
        },
    });

    return (
        <AuthLayout siteTitle={authType === 'login' ? 'Login' : 'Register'}>
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
                    label="Or continue with email"
                    labelPosition="center"
                    my="xl"
                />
                <form onSubmit={form.onSubmit(() => {})}></form>
            </Paper>
        </AuthLayout>
    );
};

export default Login;
