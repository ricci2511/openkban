import Auth from '@components/auth';
import Header from '@components/ui/header';
import Sidebar from '@components/ui/sidebar';
import React, { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
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
                    <main className="container relative mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
                <Sidebar />
            </div>
        </Auth>
    );
};

export default MainLayout;
