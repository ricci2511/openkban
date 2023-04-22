import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { SidebarClose, SidebarOpen } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@lib/helpers';

interface HeaderProps {
    sidebarOpen?: boolean;
    toggleSidebarOpen?: () => void;
}

export const Header = ({ sidebarOpen, toggleSidebarOpen }: HeaderProps) => {
    return (
        <header className="sticky top-0 w-full border-b border-secondary bg-background/90 shadow-sm">
            <div className="flex h-16 w-full items-center px-4">
                {toggleSidebarOpen && (
                    <div className="z-50 flex-none">
                        <Button
                            variant="ghost"
                            className={cn(
                                'w-9 px-0',
                                sidebarOpen && 'bg-foreground/10'
                            )}
                            onClick={toggleSidebarOpen}
                        >
                            <SidebarOpen
                                className={cn(
                                    'transition-all  duration-150',
                                    !sidebarOpen && 'rotate-0 scale-100',
                                    sidebarOpen && 'rotate-90 scale-0'
                                )}
                            />
                            <SidebarClose
                                className={cn(
                                    'absolute transition-all duration-150',
                                    !sidebarOpen && 'rotate-90 scale-0',
                                    sidebarOpen && 'rotate-0 scale-100'
                                )}
                            />
                        </Button>
                    </div>
                )}
                <div className="flex-1 px-3">
                    <a className="text-2xl font-bold normal-case">OpenKBan</a>
                </div>
                <div className="flex-none">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};
