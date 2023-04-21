import React from 'react';
import { ColorPickerProps, ColorPicker } from './color-picker';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';

interface PopoverPickerProps extends ColorPickerProps {
    isOpen: boolean;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ColorPickerPopover = ({
    isOpen,
    toggle,
    color,
    changeColor,
}: PopoverPickerProps) => {
    return (
        <Popover open={isOpen} onOpenChange={toggle}>
            <PopoverAnchor asChild>
                <div
                    className="h-4 w-4 rounded-lg"
                    style={{ backgroundColor: color }}
                />
            </PopoverAnchor>
            <PopoverContent
                align="end"
                alignOffset={-15}
                sideOffset={16}
                unstyled
            >
                <ColorPicker color={color} changeColor={changeColor} />
            </PopoverContent>
        </Popover>
    );
};
