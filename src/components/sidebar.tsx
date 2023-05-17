import React from 'react';
import { SidebarLinks } from './sidebar-links';
import { SidebarUser } from './sidebar-user';
import { cn } from '@lib/helpers';
import { Separator } from './ui/separator';

export interface SidebarProps {
    sidebarOpen: boolean;
    toggleSidebarOpen: () => void;
}

export const Sidebar = ({ sidebarOpen, toggleSidebarOpen }: SidebarProps) => {
    const onSidebarClick = () => {
        // only open on click when the sidebar is collapsed
        if (!sidebarOpen) toggleSidebarOpen();
    };

    return (
        <aside
            className={cn(
                'z-30 h-[calc(100vh-65px)] overflow-y-auto border-r border-r-secondary bg-background shadow-sm', // base styles
                'fixed top-[65px] left-0 max-w-[300px] animate-in slide-in-from-left duration-300', // mobile styles (drawer sidebar)
                'md:static md:animate-none', // desktop styles (collapsible sidebar)
                !sidebarOpen && 'hidden md:block md:cursor-pointer' // hide on mobile when sidebar is collapsed
            )}
            onClick={onSidebarClick}
        >
            <div className="flex h-full flex-col">
                <section className="flex-1 overflow-x-hidden overflow-y-scroll p-3">
                    <SidebarLinks sidebarOpen={sidebarOpen} />
                </section>
                <Separator role="separator" />
                <section className="flex-none pl-1" aria-label="user">
                    <SidebarUser sidebarOpen={sidebarOpen} />
                </section>
            </div>
        </aside>
    );
};
