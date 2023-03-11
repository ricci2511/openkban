import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';
import useGetBoards from '@hooks/use-get-boards';

const SidebarLinks = () => {
    const { boards } = useGetBoards({
        prop: 'lastInteractedAt',
        order: 'desc',
    });
    const boardLinks =
        boards &&
        boards.map((board) => (
            <li key={board.id}>
                <Link
                    href={`/board/${board.id}`}
                    className="w-full gap-4 rounded-md p-2"
                >
                    {board.title}
                </Link>
            </li>
        ));

    return (
        <ul>
            <li>
                <Link href="/dashboard">
                    <RiDashboardFill size={18} />
                    Dashboard
                </Link>
            </li>
            <div tabIndex={0} className="collapse-arrow collapse">
                <input type="checkbox" className="peer" />
                <div className="collapse-title mb-2 flex items-center gap-3 rounded-lg peer-checked:bg-base-100">
                    <HiViewBoards size={18} />
                    <span>Boards</span>
                </div>
                <ul className="collapse-content menu">
                    {boardLinks ?? <p>Failed to load recent boards</p>}
                </ul>
            </div>
        </ul>
    );
};

export default SidebarLinks;
