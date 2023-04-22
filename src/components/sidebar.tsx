import React from 'react';
import { SidebarLinks } from './sidebar-links';
import { SidebarUser } from './sidebar-user';
import { cn } from '@lib/helpers';
import { Separator } from './ui/separator';

export interface SidebarProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

export const Sidebar = ({ collapsed, toggleCollapse }: SidebarProps) => {
    const onSidebarClick = () => {
        if (collapsed) toggleCollapse();
    };

    return (
        <aside
            className={cn(
                'z-30 h-full overflow-y-auto border-r border-r-secondary bg-background shadow-sm', // base styles
                'fixed top-[65px] left-0 h-[calc(100vh-65px)] max-w-sm animate-in slide-in-from-left duration-300', // mobile styles (drawer mode)
                'md:static md:animate-none', // desktop styles (reset mobile styles)
                collapsed && 'hidden md:block md:cursor-pointer'
            )}
            onClick={onSidebarClick}
        >
            <div className="flex h-full flex-col">
                <section className="flex-1 overflow-x-hidden overflow-y-scroll p-4">
                    <SidebarLinks
                        collapsed={collapsed}
                        toggleCollapse={toggleCollapse}
                    />
                </section>
                <Separator role="separator" />
                <section className="flex-none pl-1" aria-label="user">
                    <SidebarUser
                        collapsed={collapsed}
                        toggleCollapse={toggleCollapse}
                    />
                </section>
            </div>
        </aside>
    );
};
