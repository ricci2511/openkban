import { presetColors } from '@lib/constants';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useDebounce from 'use-debouncy/lib/effect';

export interface ColorPickerProps {
    color: string;
    onChange:
        | React.Dispatch<React.SetStateAction<string>>
        | ((color: string) => void);
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
    const [value, setValue] = useState(color);
    useDebounce(() => onChange(value), 300, [value]);

    return (
        <div className="rounded-xl bg-gray-200">
            <HexColorPicker color={color} onChange={setValue} />
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 p-3">
                {presetColors.map((presetColor) => (
                    <button
                        key={presetColor}
                        className="mt-2 h-5 w-5 rounded-full"
                        style={{ background: presetColor }}
                        onClick={() => onChange(presetColor)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;
