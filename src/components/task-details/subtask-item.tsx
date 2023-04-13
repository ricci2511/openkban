import { BoardSubtask } from '@prisma/client';
import React, { useState } from 'react';
import { useUpdateSubtask } from '@hooks/mutations/use-subtask-mutations';
import { UpdateSubtaskForm } from './update-subtask-form';

export const SubtaskItem = ({ data }: { data: BoardSubtask }) => {
    const { id, title, isDone, taskId } = data;

    const [editting, setEditting] = useState(false);

    const { mutate: updateTask } = useUpdateSubtask();
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        updateTask({ id, isDone: checked });
    };

    return (
        <li className="-ml-1.5 flex items-start gap-3.5 rounded-md p-2 transition-all duration-200 hover:bg-base-300">
            <input
                type="checkbox"
                checked={isDone}
                className="checkbox-primary checkbox checkbox-sm"
                onChange={(e) => handleCheckboxChange(e)}
                aria-label={`Mark subtask ${title} as completed or not`}
            />
            {editting ? (
                <UpdateSubtaskForm
                    id={id}
                    currTitle={title}
                    stopEdittingCb={() => setEditting(false)}
                />
            ) : (
                <span
                    className="-mt-0.5 w-full"
                    onClick={() => setEditting(true)}
                >
                    {isDone ? <s>{title}</s> : <>{title}</>}
                </span>
            )}
        </li>
    );
};
