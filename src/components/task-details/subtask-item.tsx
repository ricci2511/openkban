import { BoardSubtask } from '@prisma/client';
import React, { useState } from 'react';
import { useUpdateSubtask } from '@hooks/mutations/use-subtask-mutations';
import { UpdateSubtaskForm } from './update-subtask-form';
import { Checkbox } from '@components/ui/checkbox';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { DeleteSubtaskButton } from './delete-subtask-button';

export const SubtaskItem = ({ data }: { data: BoardSubtask }) => {
    const { id, title, isDone, ownerId } = data;

    const [editting, setEditting] = useState(false);

    const canUpdate = useCanPerformEntityAction('SUBTASK', 'UPDATE', ownerId);
    const canDelete = useCanPerformEntityAction('SUBTASK', 'DELETE', ownerId);

    const updateSubtaskMutation = useUpdateSubtask();

    const onCheckedChange = (checked: boolean) => {
        if (!canUpdate) return;
        updateSubtaskMutation.mutate({ id, isDone: !!checked });
    };

    const handleStartEditting = () => {
        if (!canUpdate) return;
        setEditting(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleStartEditting();
        }
    };

    return (
        <li className="-ml-1.5 flex items-center rounded-md p-2 transition-all duration-200 hover:bg-secondary/50">
            <div className="flex flex-1 items-start gap-3.5">
                <Checkbox
                    checked={isDone}
                    onCheckedChange={onCheckedChange}
                    disabled={!canUpdate}
                    aria-label={`Mark subtask ${title} as completed or not`}
                />
                {editting ? (
                    <UpdateSubtaskForm
                        id={id}
                        currTitle={title}
                        updateSubtaskMutation={updateSubtaskMutation} // reuse the same mutation
                        stopEdittingCb={() => setEditting(false)}
                    />
                ) : (
                    <span
                        className={`-mt-0.5 w-full text-sm ${
                            canUpdate && 'cursor-pointer'
                        }`}
                        onClick={handleStartEditting}
                        onKeyDown={handleKeyDown}
                        tabIndex={canUpdate ? 0 : -1}
                        aria-readonly={!canUpdate}
                    >
                        {isDone ? <s>{title}</s> : <>{title}</>}
                    </span>
                )}
            </div>
            {!editting && canDelete && (
                <DeleteSubtaskButton id={id} title={title} />
            )}
        </li>
    );
};
