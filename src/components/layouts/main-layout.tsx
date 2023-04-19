import { Auth } from '@components/auth';
import { Header } from '@components/header';
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
            <div className="h-[calc(100vh-65px)]">
                <main className={cn('relative w-full', className)} {...rest}>
                    {children}
                </main>
            </div>
        </Auth>
    );
};
