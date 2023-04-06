import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import { RiAddFill } from 'react-icons/ri';
import { useCurrentTask, useSubtasks } from 'store/kanban-store';
import CreateSubtaskForm from './create-subtask-form';
import SubtaskItem from './subtask-item';
import { RxCheckbox } from 'react-icons/rx';

const Subtasks = () => {
    const { title } = useCurrentTask()!;
    const subtasks = useSubtasks();

    const [adding, setAdding] = useState(false);
    const stopAdding = () => setAdding(false);
    const startAdding = () => setAdding(true);

    return (
        <>
            <span className="flex items-center gap-3">
                <RxCheckbox size={22} />
                <h4 className="text-xl font-semibold">Subtasks</h4>
            </span>
            <ul className="my-3" aria-label={`Subtasks list of ${title}`}>
                {subtasks.map((subtask) => (
                    <SubtaskItem key={subtask.id} data={subtask} />
                ))}
            </ul>
            {adding ? (
                <CreateSubtaskForm stopAddingCb={stopAdding} />
            ) : (
                <Button
                    size="sm"
                    className="ml-9"
                    endIcon={<RiAddFill size={18} />}
                    onClick={startAdding}
                    aria-label="Add a subtask"
                >
                    Add a subtask
                </Button>
            )}
        </>
    );
};

export default Subtasks;
