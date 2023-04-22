import { Auth } from '@components/auth';
import { Header } from '@components/header';
import { Sidebar } from '@components/sidebar';
import { cn } from '@lib/helpers';
import React, {
    ComponentPropsWithoutRef,
    PropsWithChildren,
    useState,
} from 'react';

interface MainLayoutProps
    extends PropsWithChildren,
        ComponentPropsWithoutRef<'main'> {}

export const MainLayout = ({
    children,
    className,
    ...rest
}: MainLayoutProps) => {
    const [collapsed, setCollapsed] = useState(true);
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <Auth>
            <Header
                collapsed={collapsed}
                setCollapsed={() => setCollapsed((collapsed) => !collapsed)}
            />
            <div
                className={cn(
                    'grid min-h-[calc(100vh-65px)] animate-in slide-in-from-left duration-300',
                    !collapsed && 'grid-cols-sidebar',
                    collapsed && 'grid-cols-sidebar-collapsed'
                )}
            >
                <Sidebar
                    shown={showSidebar}
                    collapsed={collapsed}
                    setCollapsed={() => setCollapsed((collapsed) => !collapsed)}
                />
                <main className={cn('relative w-full', className)} {...rest}>
                    {children}
                </main>
            </div>
        </Auth>
    );
};
