import Link from 'next/link';
import React, { useState } from 'react';
import { RiDashboardFill } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';
import { useGetBoards } from '@hooks/use-get-boards';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from './ui/collapsible';

export const SidebarLinks = () => {
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
            <li>
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="flex flex-col"
                >
                    <CollapsibleTrigger className="flex w-full items-center space-x-4">
                        <HiViewBoards size={18} />
                        <span>Boards</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="w-full self-start">
                        <ul className="mt-2 w-full">
                            {boards &&
                                boards.map((board) => (
                                    <li key={board.id} className="w-full">
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
                    </CollapsibleContent>
                </Collapsible>
            </li>
        </ul>
    );
};
