import { Auth } from '@components/auth';
import { Header } from '@components/header';
import { Sidebar } from '@components/sidebar';
import { cn } from '@lib/helpers';
import React, { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

interface MainLayoutProps
    extends PropsWithChildren,
        ComponentPropsWithoutRef<'main'> {}

export const MainLayout = ({
    children,
    className,
    ...rest
}: MainLayoutProps) => {
    return (
        <Auth>
            <Header />
            {/* Since header size is 4rem the height should be 100vh taking into account the header height */}
            <div className="drawer-mobile drawer h-[calc(100vh-4rem)]">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col">
                    <main
                        className={cn('relative w-full', className)}
                        {...rest}
                    >
                        {children}
                    </main>
                </div>
                <Sidebar />
            </div>
        </Auth>
    );
};
