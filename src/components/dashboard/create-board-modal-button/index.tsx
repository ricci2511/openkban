import React, { useState } from 'react';
import CreateBoardModal from './create-board-modal';

const CreateBoardModalButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen((open) => !open);
    return (
        <>
            <button className="btn-primary btn" onClick={toggleModal}>
                Add Board
            </button>
            <CreateBoardModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </>
    );
};

export default CreateBoardModalButton;
