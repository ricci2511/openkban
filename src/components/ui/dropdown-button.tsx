import React, { ComponentProps } from 'react';
import { Button } from 'react-daisyui';

type ButtonType = ComponentProps<typeof Button>;

interface DropdownButtonProps extends ButtonType {
    text: string;
}

/**
 * @returns Standard button used in dropdown menus
 */
export const DropdownButton = ({ text, ...rest }: DropdownButtonProps) => {
    return (
        <Button className="justify-start border-0" variant="outline" {...rest}>
            {text}
        </Button>
    );
};
