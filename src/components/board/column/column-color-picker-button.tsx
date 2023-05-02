import { Button } from '@components/ui/button';
import { useState } from 'react';
import { ColumnColorPicker } from './column-color-picker';

interface ColumnColorPickerButtonProps {
    columnId: string;
    color: string;
}

export const ColumnColorPickerButton = ({
    columnId,
    color,
}: ColumnColorPickerButtonProps) => {
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setColorPickerOpen(true)}
                title="Modifty the color for your column"
            >
                <div
                    className="h-4 w-4 rounded-lg"
                    style={{ backgroundColor: color }}
                />
            </Button>
            {colorPickerOpen && (
                <ColumnColorPicker
                    columnId={columnId}
                    color={color}
                    toggle={setColorPickerOpen}
                />
            )}
        </>
    );
};
