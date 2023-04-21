import { PRESET_COLORS } from '@lib/constants';
import { ComponentPropsWithoutRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useDebounce from 'use-debouncy/lib/effect';

export interface ColorPickerProps {
    color: string;
    changeColor:
        | React.Dispatch<React.SetStateAction<string>>
        | ((color: string) => void);
}

export const ColorPicker = ({ color, changeColor }: ColorPickerProps) => {
    const [value, setValue] = useState(color);
    useDebounce(() => changeColor(value), 600, [value]);

    return (
        <div className="max-w-[200px] rounded-xl bg-secondary shadow-md">
            <HexColorPicker color={color} onChange={setValue} />
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 p-3">
                {PRESET_COLORS.map((presetColor) => (
                    <span
                        key={presetColor}
                        className="mt-2 h-5 w-5 rounded-full"
                        style={{ background: presetColor }}
                        onClick={() => changeColor(presetColor)}
                    />
                ))}
            </div>
        </div>
    );
};
