import React from 'react';
import { useCurrentTask, useSubtasks } from 'store/kanban-store';
import { SubtaskItem } from './subtask-item';
import { ListChecks } from 'lucide-react';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { AddSubtaskButton } from './add-subtask-button';

export const Subtasks = () => {
    const { title } = useCurrentTask()!;
    const subtasks = useSubtasks();

    const canCreateSubtask = useCanPerformEntityAction('SUBTASK', 'CREATE');

    return (
        <>
            <span className="flex items-center gap-3">
                <ListChecks className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Subtasks</h4>
            </span>
            <ul className="my-3" aria-label={`Subtasks list of ${title}`}>
                {subtasks.map((subtask) => (
                    <SubtaskItem key={subtask.id} data={subtask} />
                ))}
            </ul>
            {canCreateSubtask && <AddSubtaskButton />}
        </>
    );
};
