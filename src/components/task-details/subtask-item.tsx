import { useUpdateSubtask } from '@hooks/use-update-subtask';
import { BoardSubtask } from '@prisma/client';
import React from 'react';

const SubtaskItem = ({ data }: { data: BoardSubtask }) => {
    const { id, title, isDone, taskId } = data;
    const { mutate: updateTask } = useUpdateSubtask();

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        updateTask({ id, isDone: checked });
    };

    return (
        <li className="flex items-center gap-3 rounded-md p-2 transition-all duration-200 hover:bg-base-200">
            <input
                type="checkbox"
                checked={isDone}
                className="checkbox-primary checkbox"
                onChange={(e) => handleCheckboxChange(e)}
                aria-label={`Mark subtask ${title} as completed or not`}
            />
            <span>{isDone ? <s>{title}</s> : <>{title}</>}</span>
        </li>
    );
};

export default SubtaskItem;
