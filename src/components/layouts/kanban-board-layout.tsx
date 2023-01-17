import React, { PropsWithChildren, useState } from 'react';
import MainLayout from './main-layout';
import CreateTaskModal from '@components/board/create-task-modal';
import { MdLibraryAdd } from 'react-icons/md';

const KanbanBoardLayout = ({ children }: PropsWithChildren) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen((open) => !open);

    return (
        <>
            <MainLayout>
                {children}
                <div
                    className="tooltip tooltip-left tooltip-info absolute top-4 right-4 md:top-6 md:right-6"
                    data-tip="Add a new task"
                >
                    <button
                        className="btn-outline btn-circle btn"
                        onClick={toggleModal}
                        aria-label="Open modal to create a new task"
                    >
                        <MdLibraryAdd size={18} />
                    </button>
                </div>
            </MainLayout>
            <CreateTaskModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </>
    );
};

export default KanbanBoardLayout;
