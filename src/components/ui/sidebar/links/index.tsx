import Link from 'next/link';
import React, { useState } from 'react';
import { RiDashboardFill } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';
import useGetBoards from '@hooks/use-get-boards';
import { Collapse } from 'react-daisyui';

const SidebarLinks = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { boards, fetchStatus, isError } = useGetBoards(
        {
            prop: 'lastInteractedAt',
            order: 'desc',
        },
        isOpen // will only query for boards if isOpen is true
    );

    return (
        <ul>
            <li>
                <Link href="/dashboard">
                    <RiDashboardFill size={18} />
                    Dashboard
                </Link>
            </li>
            <Collapse
                className="group"
                checkbox={true}
                icon="arrow"
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
            >
                <Collapse.Title className="flex items-center gap-3 rounded-lg peer-checked:bg-base-100">
                    <HiViewBoards size={18} />
                    <span>Boards</span>
                </Collapse.Title>
                <Collapse.Content>
                    <ul className="menu mt-2">
                        {boards &&
                            boards.map((board) => (
                                <li key={board.id}>
                                    <Link
                                        href={`/board/${board.id}`}
                                        className="w-full gap-4 rounded-md p-2"
                                    >
                                        {board.title}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                    {fetchStatus === 'fetching' && <p>Loading...</p>}
                    {isError && <p>Failed to load recent boards</p>}
                </Collapse.Content>
            </Collapse>
        </ul>
    );
};

export default SidebarLinks;
