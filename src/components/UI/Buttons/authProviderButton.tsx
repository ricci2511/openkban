import { Button } from '@mantine/core';
import React, { ReactElement } from 'react';

type AuthProviderButtonProps = {
    buttonText: string;
    icon: JSX.Element;
};

const AuthProviderButton = ({ buttonText, icon }: AuthProviderButtonProps) => {
    return (
        <Button variant="default" fullWidth leftIcon={icon}>
            {buttonText}
        </Button>
    );
};

export default AuthProviderButton;
