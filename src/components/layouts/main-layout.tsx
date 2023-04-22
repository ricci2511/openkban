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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleOpen = () => setSidebarOpen((open) => !open);

    return (
        <Auth>
            <Header sidebarOpen={sidebarOpen} toggleSidebarOpen={toggleOpen} />
            <div
                className={cn(
                    'relative grid min-h-[calc(100vh-65px)] md:transition-[grid-template-columns] md:duration-300 md:ease-in-out',
                    // on mobile, the sidebar acts as a drawer (overlaps the main content)
                    // on desktop, the sidebar is collapsible (pushes the main content to the right)
                    sidebarOpen && 'md:grid-cols-[300px,auto]',
                    !sidebarOpen && 'md:grid-cols-[64px,auto]'
                )}
            >
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    toggleSidebarOpen={toggleOpen}
                />
                <div
                    className={cn(
                        'fixed top-[65px] right-0 h-full w-full cursor-pointer bg-black/60 opacity-0 animate-in fade-in-100 duration-200 md:hidden',
                        sidebarOpen && 'z-20 opacity-100'
                    )}
                    onClick={() => setSidebarOpen(false)}
                />
                <main className={cn('relative w-full', className)} {...rest}>
                    {children}
                </main>
            </div>
        </Auth>
    );
};
