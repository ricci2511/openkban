import Auth from '@components/auth';
import Header from '@components/ui/header';
import Sidebar from '@components/ui/sidebar';
import React, { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

interface MainLayoutProps
    extends PropsWithChildren,
        ComponentPropsWithoutRef<'main'> {
    responsive?: boolean;
}

const MainLayout = ({
    children,
    responsive = false,
    ...rest
}: MainLayoutProps) => {
    const nonResponsiveMain = 'relative w-full';
    const responsiveMain = `container mx-auto p-4 sm:p-6 lg:p-8 ${nonResponsiveMain}`;

    return (
        <Auth>
            <Header withDrawerBtn />
            {/* Since header size is 4rem the height should be 100vh taking into account the header height */}
            <div className="drawer-mobile drawer h-[calc(100vh-4rem)]">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col">
                    <main
                        className={`${
                            responsive ? responsiveMain : nonResponsiveMain
                        }`}
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

export default MainLayout;
