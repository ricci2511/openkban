import React, { useCallback, useRef, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import ColorPicker, { ColorPickerProps } from '.';

const PopoverPicker = ({ color, changeColor, ...rest }: ColorPickerProps) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useOnClickOutside(popoverRef, close);

    return (
        <div className="relative z-10" {...rest}>
            <div
                role="button"
                className="h-5 w-5 rounded-lg"
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />
            {isOpen && (
                <div ref={popoverRef} className="absolute right-0 top-8">
                    <ColorPicker color={color} changeColor={changeColor} />
                </div>
            )}
        </div>
    );
};

export default PopoverPicker;
