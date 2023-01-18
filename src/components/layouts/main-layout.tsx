import Auth from '@components/auth';
import Header from '@components/ui/header';
import Sidebar from '@components/ui/sidebar';
import React, { PropsWithChildren } from 'react';

interface MainLayoutProps extends PropsWithChildren {
    responsive?: boolean;
}

const MainLayout = ({ children, responsive = false }: MainLayoutProps) => {
    const nonResponsiveMain = 'relative w-full p-4 sm:p-6 lg:p-8';
    const responsiveMain = `container mx-auto ${nonResponsiveMain}`;

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
