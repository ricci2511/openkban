import React from 'react';
import { SidebarLinks } from './sidebar-links';
import { SidebarUser } from './sidebar-user';
import { cn } from '@lib/helpers';
import { Separator } from './ui/separator';

export interface SidebarProps {
    shown: boolean;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ shown, collapsed, setCollapsed }: SidebarProps) => {
    const onSidebarClick = () => {
        if (collapsed) setCollapsed(false);
    };

    return (
        <aside
            className={cn(
                'z-30 h-full overflow-y-auto border-r border-r-secondary bg-background/90 shadow-sm',
                collapsed && 'cursor-pointer'
            )}
            onClick={onSidebarClick}
        >
            <div className="flex h-full flex-col">
                <section className="flex-1 overflow-x-hidden overflow-y-scroll p-4">
                    <SidebarLinks
                        shown={shown}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                </section>
                <Separator role="separator" />
                <section className="flex-none pl-1" aria-label="user">
                    <SidebarUser
                        shown={shown}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                </section>
            </div>
        </aside>
    );
};
