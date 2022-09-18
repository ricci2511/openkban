import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitchSelect = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <select
            value={theme}
            className="select w-full max-w-xs"
            onChange={(e) => setTheme(e.target.value)}
        >
            <option value="system">Auto</option>
            <option value="dark">Dark mode</option>
            <option value="light">Light mode</option>
        </select>
    );
};

export default ThemeSwitchSelect;
