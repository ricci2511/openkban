import { useSession } from 'next-auth/react';
import React from 'react';
import { LoadingSpinner } from './ui/loading-spinner';
import { SidebarLinks } from './sidebar-links';
import { SidebarUser } from './sidebar-user';

const Sidebar = () => {
    const { data: session, status } = useSession();

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <nav className="menu max-w-xs overflow-y-auto bg-base-200 p-4 text-base-content">
                <section
                    className="flex-1 overflow-y-scroll"
                    aria-label="primary links"
                >
                    <SidebarLinks />
                </section>
                <section className="flex-none" aria-label="user">
                    {status === 'loading' && <LoadingSpinner />}
                    {session && <SidebarUser session={session} />}
                </section>
            </nav>
        </div>
    );
};

export default Sidebar;
