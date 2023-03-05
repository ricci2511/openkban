import React, { useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import CreateTaskModal from './create-task-modal';

const CreateTaskModalButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <div
                className="tooltip tooltip-right tooltip-info"
                data-tip="Add a new task"
            >
                <button
                    className="btn-outline btn-circle btn"
                    onClick={() => setIsDialogOpen(true)}
                    aria-label="Open modal to create a new task"
                >
                    <MdLibraryAdd size={18} />
                </button>
            </div>
            <CreateTaskModal
                open={isDialogOpen}
                closeDialog={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default CreateTaskModalButton;
