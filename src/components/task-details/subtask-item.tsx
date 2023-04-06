import { useUpdateSubtask } from '@hooks/use-update-subtask';
import { BoardSubtask } from '@prisma/client';
import React, { useState } from 'react';
import UpdateSubtaskForm from './update-subtask-form';

const SubtaskItem = ({ data }: { data: BoardSubtask }) => {
    const { id, title, isDone, taskId } = data;

    const [editting, setEditting] = useState(false);

    const { mutate: updateTask } = useUpdateSubtask();
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        updateTask({ id, isDone: checked });
    };

    return (
        <li className="flex items-start gap-3 rounded-md p-2 transition-all duration-200 hover:bg-base-200">
            <input
                type="checkbox"
                checked={isDone}
                className="checkbox-primary checkbox"
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
                <span className="w-full" onClick={() => setEditting(true)}>
                    {isDone ? <s>{title}</s> : <>{title}</>}
                </span>
            )}
        </li>
    );
};

export default SubtaskItem;
