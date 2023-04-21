import React from 'react';
import { ColorPickerProps, ColorPicker } from './color-picker';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { PopoverContentProps } from '@radix-ui/react-popover';

// ColorPickerProps has a color prop that is required, hence the need to omit it
export type PopoverContentPropsWithoutColor = Omit<
    PopoverContentProps,
    'color' | 'unstyled'
>;

interface PopoverPickerProps
    extends ColorPickerProps,
        PopoverContentPropsWithoutColor {
    isOpen: boolean;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
}
export const ColorPickerPopover = ({
    isOpen,
    toggle,
    color,
    changeColor,
    children, // optional element to position the PopoverContent against, if not provided, an invisible PopoverAnchor will be used
    ...props
}: PopoverPickerProps) => {
    return (
        <Popover open={isOpen} onOpenChange={toggle}>
            {children ? (
                <PopoverAnchor asChild>{children}</PopoverAnchor>
            ) : (
                <PopoverAnchor />
            )}
            <PopoverContent
                {...props}
                align={props.align ?? 'end'}
                sideOffset={22 ?? props.sideOffset}
                unstyled
            >
                <ColorPicker color={color} changeColor={changeColor} />
            </PopoverContent>
        </Popover>
    );
};
