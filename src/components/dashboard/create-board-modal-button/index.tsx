import React, { useState } from 'react';
import CreateBoardModal from './create-board-modal';

const CreateBoardModalButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <button
                className="btn-primary btn"
                onClick={() => setIsDialogOpen(true)}
            >
                Add Board
            </button>
            <CreateBoardModal
                open={isDialogOpen}
                closeDialog={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default CreateBoardModalButton;
