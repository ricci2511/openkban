import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { SidebarClose, SidebarOpen } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@lib/helpers';

interface HeaderProps {
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
}

export const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-secondary bg-background/90 shadow-sm">
            <div className="flex h-16 w-full items-center px-4 lg:px-6">
                {setCollapsed && (
                    <div className="flex-none">
                        <Button
                            variant="ghost"
                            className={cn(
                                'w-9 px-0',
                                !collapsed && 'bg-foreground/10'
                            )}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <SidebarOpen
                                className={cn(
                                    'transition-all  duration-150',
                                    collapsed && 'rotate-0 scale-100',
                                    !collapsed && 'rotate-90 scale-0'
                                )}
                            />
                            <SidebarClose
                                className={cn(
                                    'absolute transition-all duration-150',
                                    collapsed && 'rotate-90 scale-0',
                                    !collapsed && 'rotate-0 scale-100'
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
