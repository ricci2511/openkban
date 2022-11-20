import { cva } from 'class-variance-authority';
import { VariantProps, cx } from 'class-variance-authority';
import React from 'react';

const dropdownBase = cva('dropdown', {
    variants: {
        position: {
            top: ['dropdown-top'],
            end: ['dropdown-end'],
            topEnd: ['dropdown-top', 'dropdown-end'],
            bottom: ['dropdown-bottom'],
            bottomEnd: ['dropdown-bottom', 'dropdown-end'],
            left: ['dropdown-left'],
            leftEnd: ['dropdown-left', 'dropdown-end'],
            right: ['dropdown-right'],
            rightEnd: ['dropdown-right', 'dropdown-end'],
        },
        display: {
            onHover: ['dropdown-hover'],
            forceOpen: ['dropdown-open'],
        },
    },
});

interface DropdownProps extends VariantProps<typeof dropdownBase> {
    children?: React.ReactNode;
    labelClassName?: string;
    contentClassName?: string;
    labelIcon?: JSX.Element;
    labelText?: string;
}

const DropdownButton = ({
    children,
    position,
    display,
    labelClassName,
    contentClassName,
    labelIcon,
    labelText,
}: DropdownProps = {}) => {
    return (
        <div className={dropdownBase({ position, display })}>
            <label tabIndex={0} className={labelClassName}>
                {labelIcon}
                {labelText}
            </label>
            <ul
                tabIndex={0}
                className={cx('dropdown-content menu', contentClassName)}
            >
                {children}
            </ul>
        </div>
    );
};

export default DropdownButton;
