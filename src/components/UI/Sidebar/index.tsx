import { useSession } from 'next-auth/react';
import React from 'react';
import User from './user';
import { BarsScaleFade } from 'react-svg-spinners';
import SidebarLinks from './links';

const Sidebar = () => {
    const { data: session, status } = useSession();

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <nav className="menu w-80 overflow-y-auto bg-base-200 p-4 text-base-content">
                <section className="flex-1" aria-label="primary links">
                    <SidebarLinks />
                </section>
                <section className="flex-none" aria-label="user">
                    {status === 'loading' && (
                        <div className="mx-auto flex items-center justify-center">
                            <BarsScaleFade />
                        </div>
                    )}
                    {session && <User session={session} />}
                </section>
            </nav>
        </div>
    );
};

export default Sidebar;
