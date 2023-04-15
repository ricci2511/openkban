import React from 'react';
import { BoardUserAvatar } from '@components/board-user-avatar';
import { RxCross1, RxPerson } from 'react-icons/rx';
import { useBoardUsers, useIsAdminUser } from 'store/kanban-store';
import { useSession } from 'next-auth/react';
import { CreateTaskDialog } from './task-creation/create-task-dialog';

export const KanbanHeaderSection = ({ title }: { title: string }) => {
    const boardUsers = useBoardUsers();
    const isAdmin = useIsAdminUser();

    const { data: session } = useSession();

    return (
        <section className="flex h-auto w-full flex-wrap items-center justify-between gap-3 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-x-5">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <CreateTaskDialog />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <ul className="flex flex-wrap gap-2" aria-label="Board members">
                    {boardUsers.map((user) => (
                        <li key={user.userId} className="group relative">
                            {isAdmin && session?.user?.id !== user.userId && (
                                <button className="btn-error invisible absolute -right-1 -top-2 rounded-full p-1 group-hover:visible">
                                    <RxCross1 size={8} />
                                </button>
                            )}
                            <BoardUserAvatar boardUser={user} />
                        </li>
                    ))}
                </ul>
                {isAdmin && (
                    <button className="btn-outline btn-square btn-sm btn">
                        <RxPerson />
                    </button>
                )}
            </div>
        </section>
    );
};
