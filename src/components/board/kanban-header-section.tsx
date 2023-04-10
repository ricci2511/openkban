import React, { useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import { CreateTaskModal } from './task-creation/create-task-modal';

export const KanbanHeaderSection = ({ title }: { title: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="fixed flex w-full items-center gap-x-6 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold uppercase">{title}</h1>
            <div
                className="tooltip tooltip-right tooltip-info"
                data-tip="Add a new task"
            >
                <button
                    className="btn-outline btn-circle btn"
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Open modal to create a new task"
                >
                    <MdLibraryAdd size={18} />
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
