import React, { ComponentProps } from 'react';
import { Button } from 'react-daisyui';

type ButtonType = ComponentProps<typeof Button>;

interface DropdownButtonProps {
    text: string;
    color?: ButtonType['color'];
    startIcon?: ButtonType['startIcon'];
    loading?: ButtonType['loading'];
    animation?: ButtonType['animation'];
    ariaLabel?: ButtonType['aria-label'];
    onClick: ButtonType['onClick'];
}

/**
 * @returns Standard button used in dropdown menus
 */
const DropdownButton = ({
    text,
    color,
    startIcon,
    loading,
    animation,
    ariaLabel,
    onClick,
}: DropdownButtonProps) => {
    return (
        <Button
            className="justify-start border-0"
            variant="outline"
            color={color}
            startIcon={startIcon}
            loading={loading}
            animation={animation}
            aria-label={ariaLabel}
            onClick={onClick}
        >
            {text}
        </Button>
    );
};

export default DropdownButton;
