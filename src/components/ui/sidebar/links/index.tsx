import Link from 'next/link';
import React from 'react';
import { RiDashboardFill, RiStarFill } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';

const SidebarLinks = () => {
    return (
        <ul>
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
        </ul>
    );
};

export default SidebarLinks;
