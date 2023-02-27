import { PRESET_COLORS } from '@lib/constants';
import { ComponentPropsWithoutRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useDebounce from 'use-debouncy/lib/effect';

export interface ColorPickerProps extends ComponentPropsWithoutRef<'div'> {
    color: string;
    changeColor:
        | React.Dispatch<React.SetStateAction<string>>
        | ((color: string) => void);
}

const ColorPicker = ({ color, changeColor, ...rest }: ColorPickerProps) => {
    const [value, setValue] = useState(color);
    useDebounce(() => changeColor(value), 300, [value]);

    return (
        <div className="rounded-xl bg-gray-200">
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

export default ColorPicker;
