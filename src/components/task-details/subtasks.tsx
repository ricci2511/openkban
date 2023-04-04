import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import { RiAddFill } from 'react-icons/ri';
import { useSubtasks } from 'store/kanban-store';
import CreateSubtaskForm from './create-subtask-form';

const Subtasks = () => {
    const subtasks = useSubtasks();

    const [adding, setAdding] = useState(false);
    const stopAdding = () => setAdding(false);
    const startAdding = () => setAdding(true);

    return (
        <div>
            <h4 className="text-xl font-semibold">Subtasks</h4>
            <ul className="mb-3">
                {subtasks.map((subtask) => (
                    <li key={subtask.id}>{subtask.title}</li>
                ))}
            </ul>
            {adding ? (
                <CreateSubtaskForm stopAddingCb={stopAdding} />
            ) : (
                <Button
                    size="sm"
                    endIcon={<RiAddFill size={18} />}
                    onClick={startAdding}
                >
                    Add a subtask
                </Button>
            )}
        </div>
    );
};

export default Subtasks;
