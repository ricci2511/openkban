import Header from '@components/ui/Header';
import Sidebar from '@components/ui/Sidebar';
import React, { useState } from 'react';

const MainLayout = ({ children }: { children: JSX.Element }) => {
    return (
        <>
            <Header withDrawerBtn />
            {/* Since header size is 4rem the height should be 100vh taking into account the header height */}
            <div className="drawer-mobile drawer h-[calc(100vh-4rem)]">
                <input
                    id="my-drawer-2"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col">
                    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
                <Sidebar />
            </div>
        </>
    );
};

export default MainLayout;
