import { BoardSubtask } from '@prisma/client';
import React, { useState } from 'react';
import { useUpdateSubtask } from '@hooks/mutations/use-subtask-mutations';
import { UpdateSubtaskForm } from './update-subtask-form';
import { Checkbox } from '@components/ui/checkbox';

export const SubtaskItem = ({ data }: { data: BoardSubtask }) => {
    const { id, title, isDone, taskId } = data;

    const [editting, setEditting] = useState(false);

    const { mutate: updateTask } = useUpdateSubtask();

    return (
        <li className="hover:bg-base-300 -ml-1.5 flex items-start gap-3.5 rounded-md p-2 transition-all duration-200">
            <Checkbox
                checked={isDone}
                onCheckedChange={(checked) =>
                    updateTask({ id, isDone: !!checked })
                }
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
                    className="-mt-1.5 w-full"
                    onClick={() => setEditting(true)}
                >
                    {isDone ? <s>{title}</s> : <>{title}</>}
                </span>
            )}
        </li>
    );
};
