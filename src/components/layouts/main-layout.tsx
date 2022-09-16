import Header from '@components/UI/Header';
import Sidebar from '@components/UI/Sidebar';
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
                <div className="drawer-content flex flex-col bg-gray-700 p-4">
                    <main>{children}</main>
                </div>
                <Sidebar />
            </div>
        </>
    );
};

export default MainLayout;
