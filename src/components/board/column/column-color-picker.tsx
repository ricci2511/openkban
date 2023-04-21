import {
    ColorPickerPopover,
    PopoverContentPropsWithoutColor,
} from '@components/color-picker-popover';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';

interface ColumnColorPickerProps extends PopoverContentPropsWithoutColor {
    id: string;
    color: string;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ColumnColorPicker = ({
    id,
    color,
    toggle,
    ...props
}: ColumnColorPickerProps) => {
    const { mutate: updateColumn, isLoading } = useUpdateColumn();

    const handleColorChange = (newColor: string) => {
        // prevent updating if color is the same or if already mutating
        if (color === newColor || isLoading) return;
        updateColumn({
            id,
            color: newColor,
        });
    };

    return (
        <ColorPickerPopover
            isOpen={true}
            toggle={toggle}
            color={color}
            changeColor={handleColorChange}
            {...props}
        />
    );
};
