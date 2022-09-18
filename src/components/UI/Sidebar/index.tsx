import { useSession } from 'next-auth/react';
import React from 'react';
import User from './user';
import { BarsScaleFade } from 'react-svg-spinners';
import { RiDashboardFill, RiStarFill } from 'react-icons/ri';

const Sidebar = () => {
    const { data: session, status } = useSession();

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <nav className="menu w-80 overflow-y-auto bg-base-200 p-4 text-base-content">
                <div className="flex-1">
                    <li>
                        <a>
                            <RiDashboardFill size={18} />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a>
                            <RiStarFill size={18} /> Favorites
                        </a>
                    </li>
                </div>
                {status === 'loading' && (
                    <div className="mx-auto flex items-center justify-center">
                        <BarsScaleFade />
                    </div>
                )}
                {session && <User session={session} />}
            </nav>
        </div>
    );
};

export default Sidebar;
