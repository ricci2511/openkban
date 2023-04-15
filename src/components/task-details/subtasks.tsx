import React, { useState } from 'react';
import { useCurrentTask, useSubtasks } from 'store/kanban-store';
import { RxCheckbox, RxPlus } from 'react-icons/rx';
import { SubtaskItem } from './subtask-item';
import { CreateSubtaskForm } from './create-subtask-form';

export const Subtasks = () => {
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
                <button
                    className="btn-sm btn ml-9 flex gap-2"
                    onClick={startAdding}
                    aria-label="Add a subtask"
                >
                    <span>Add a subtask</span>
                    <RxPlus size={18} />
                </button>
            )}
        </>
    );
};
