import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HiMoon, HiSun } from 'react-icons/hi';

export const ThemeSwitchButton = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleThemeChange = () =>
        setTheme(theme === 'dark' ? 'light' : 'dark');

    const labelDescription = `Switch between dark and light mode, currently set to ${theme}`;

    return (
        <label
            className="swap-rotate swap"
            aria-label={labelDescription}
            title={labelDescription}
        >
            <input type="checkbox" onClick={handleThemeChange} />
            <HiSun className="swap-on fill-current" size={22} />
            <HiMoon className="swap-off fill-current" size={22} />
        </label>
    );
};
