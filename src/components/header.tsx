import React from 'react';
import { ThemeSwitchButton } from './theme-switch-button';
import { Sidebar } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur">
            <div className="flex h-16 w-full items-center px-4 lg:px-6">
                <div className="flex-none lg:hidden">
                    <Button variant="ghost" className="w-9 px-0">
                        <Sidebar size={22} />
                    </Button>
                </div>
                <div className="flex-1 px-3">
                    <a className="text-2xl font-bold normal-case">OpenKBan</a>
                </div>
                <div className="flex-none">
                    <ThemeSwitchButton />
                </div>
            </div>
        </header>
    );
};
