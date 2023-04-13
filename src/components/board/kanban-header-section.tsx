import React, { useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import { CreateTaskModal } from './task-creation/create-task-modal';
import { BoardUserAvatar } from '@components/board-user-avatar';
import { RxCross1, RxPerson } from 'react-icons/rx';
import { useBoardUsers, useIsAdminUser } from 'store/kanban-store';
import { useSession } from 'next-auth/react';
import { Button } from 'react-daisyui';

export const KanbanHeaderSection = ({ title }: { title: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const boardUsers = useBoardUsers();
    const isAdmin = useIsAdminUser();

    const { data: session } = useSession();

    return (
        <section className="flex h-auto w-full flex-wrap items-center justify-between gap-3 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-x-5">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <div
                    className="tooltip tooltip-right tooltip-info"
                    data-tip="Add a new task"
                >
                    <button
                        className="btn-outline btn-circle btn max-h-2"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Open modal to create a new task"
                    >
                        <MdLibraryAdd size={16} />
                    </button>
                </div>
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
                    <Button
                        variant="outline"
                        size="sm"
                        shape="square"
                        endIcon={<RxPerson />}
                    />
                )}
            </div>
            {isModalOpen && (
                <CreateTaskModal
                    open={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};
