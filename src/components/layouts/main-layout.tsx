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

    const toggleCollapsed = () => {
        setCollapsed((collapsed) => !collapsed);
    };

    return (
        <Auth>
            <Header collapsed={collapsed} toggleCollapse={toggleCollapsed} />
            <div
                className={cn(
                    'relative grid min-h-[calc(100vh-65px)] md:transition-[grid-template-columns] md:duration-300 md:ease-in-out',
                    // on mobile, the sidebar acts as a drawer (overlaps the main content)
                    !collapsed && 'md:grid-cols-sidebar',
                    collapsed && 'md:grid-cols-sidebar-collapsed'
                )}
            >
                <Sidebar
                    collapsed={collapsed}
                    toggleCollapse={toggleCollapsed}
                />
                <main className={cn('relative w-full', className)} {...rest}>
                    {children}
                </main>
            </div>
        </Auth>
    );
};
