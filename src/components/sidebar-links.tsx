import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useGetBoards } from '@hooks/use-get-boards';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from './ui/collapsible';
import { SidebarProps } from './sidebar';
import { LayoutDashboard, Table } from 'lucide-react';
import { cn } from '@lib/helpers';

export const SidebarLinks = ({
    sidebarOpen,
}: Pick<SidebarProps, 'sidebarOpen'>) => {
    const [isOpen, setIsOpen] = useState(false);

    // close the boards collapsible if sidebar is collapsed
    useEffect(() => {
        if (!sidebarOpen) setIsOpen(false);
    }, [sidebarOpen]);

    const { boards, fetchStatus, isError } = useGetBoards(
        {
            prop: 'lastInteractedAt',
            order: 'desc',
        },
        isOpen // will only query for boards if isOpen is true
    );

    return (
        <ul className="flex flex-col items-stretch gap-3">
            <li className="flex rounded-md p-2 transition-all duration-200 ease-in hover:bg-muted/60">
                <Link
                    href="/dashboard"
                    className="grid w-full grid-cols-[16px,auto] items-center gap-4"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span
                        className={cn(
                            'text-base opacity-0 transition-opacity duration-200',
                            sidebarOpen && 'opacity-100'
                        )}
                    >
                        Dashboard
                    </span>
                </Link>
            </li>
            <li className="flex rounded-md p-2 transition-colors duration-200 ease-in hover:bg-muted/60">
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full"
                >
                    <CollapsibleTrigger className="grid w-full grid-cols-[16px,auto] items-center gap-4">
                        <Table className="h-4 w-4" />
                        <span
                            className={cn(
                                'justify-self-start text-base opacity-0 transition-opacity duration-200',
                                sidebarOpen && 'opacity-100'
                            )}
                        >
                            Boards
                        </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="w-full self-start">
                        <ul className="mt-4 ml-7 flex w-full flex-col gap-1">
                            {boards &&
                                boards.map((board) => (
                                    <li
                                        key={board.id}
                                        className="w-[12rem] rounded-md p-1.5 transition-colors duration-150 ease-in hover:bg-muted"
                                    >
                                        <Link
                                            href={`/board/${board.id}`}
                                            className="block w-full rounded-md"
                                        >
                                            <span className="truncate text-sm sm:text-base">
                                                {board.title}
                                            </span>
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
