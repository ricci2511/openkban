import AuthLayout from '@components/layouts/authLayout';
import { NextPage } from 'next';
import React from 'react';

const Login: NextPage = () => {
    return (
        <AuthLayout>
            <div>Login Page!</div>
        </AuthLayout>
    );
};

export default Login;
