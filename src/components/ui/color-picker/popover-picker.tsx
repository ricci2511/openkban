import React, { useCallback } from 'react';
import ColorPicker, { ColorPickerProps } from '.';
import { useClickOutside } from '@hooks/use-click-outside';

interface PopoverPickerProps extends ColorPickerProps {
    isOpen: boolean;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const PopoverPicker = ({
    isOpen,
    toggle,
    color,
    changeColor,
    ...rest
}: PopoverPickerProps) => {
    const close = useCallback(() => toggle(false), [toggle]);
    const popoverRef = useClickOutside<HTMLDivElement>(close);

    return (
        <div className="relative z-10">
            <div
                className="h-4 w-4 rounded-lg"
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />
            {isOpen && (
                <div ref={popoverRef} {...rest}>
                    <ColorPicker color={color} changeColor={changeColor} />
                </div>
            )}
        </div>
    );
};

export default PopoverPicker;
