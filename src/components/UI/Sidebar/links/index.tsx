import Link from 'next/link';
import React from 'react';
import { RiDashboardFill, RiStarFill } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';

const SidebarLinks = () => {
    return (
        <>
            <li>
                <Link href="/dashboard">
                    <RiDashboardFill size={18} />
                    Dashboard
                </Link>
            </li>
            <li>
                <Link href="/boards">
                    <HiViewBoards size={18} /> Boards
                </Link>
            </li>
            {/* 
            <li>
                <div
                    tabIndex={0}
                    className="collapse-arrow collapse my-auto flex flex-col "
                >
                    <div className="collapse-title flex min-h-0 items-center gap-3 p-0">
                        <RiStarFill size={18} />
                        <span>Favorites</span>
                    </div>
                    <ul className="collapse-content">
                        <li>No favorites yet :(</li>
                    </ul>
                </div>
            </li>
            */}
        </>
    );
};

export default SidebarLinks;
