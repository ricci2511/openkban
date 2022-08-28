import { Button } from '@mantine/core';
import React, { ReactElement } from 'react';

type AuthProviderButtonProps = {
    buttonText: string;
    icon: JSX.Element;
};

const AuthProviderButton = ({ buttonText, icon }: AuthProviderButtonProps) => {
    return (
        <Button
            size="sm"
            variant="gradient"
            fullWidth
            gradient={{ from: 'black', to: 'gray' }}
            leftIcon={icon}
        >
            {buttonText}
        </Button>
    );
};

export default AuthProviderButton;
