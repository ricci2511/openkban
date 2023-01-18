import React, { useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import CreateTaskModal from './create-task-modal';

const CreateTaskModalButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen((open) => !open);
    return (
        <>
            <div
                className="tooltip tooltip-right tooltip-info"
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
            <CreateTaskModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </>
    );
};

export default CreateTaskModalButton;
