import React, { useMemo, useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import { CreateTaskModal } from './task-creation/create-task-modal';
import { ClientBoardUser } from 'types/board-types';
import { BoardUserAvatar } from '@components/board-user-avatar';
import { RxPlus } from 'react-icons/rx';

interface KanbanHeaderSectionProps {
    title: string;
    boardUsers: ClientBoardUser[];
}

export const KanbanHeaderSection = ({
    title,
    boardUsers,
}: KanbanHeaderSectionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div className="flex flex-wrap items-center gap-2">
                <ul className="flex flex-wrap gap-2" aria-label="Board members">
                    {boardUsers.map((user) => (
                        <li key={user.userId}>
                            <BoardUserAvatar boardUser={user} />
                        </li>
                    ))}
                </ul>
                {/* TODO: button to add users, will be visible to ADMIN only */}
                <button className="btn-outline btn-square btn-sm btn">
                    <RxPlus />
                </button>
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
