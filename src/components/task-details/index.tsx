import React from 'react';
import { useCurrentTask } from 'store/kanban-store';
import { Description } from './description';
import { Subtasks } from './subtasks';
import { ClipboardSignature } from 'lucide-react';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';

export const TaskDetails = () => {
    const task = useCurrentTask()!;
    const canUpdateTask = useCanPerformEntityAction(
        'TASK',
        'UPDATE',
        task.ownerId
    );

    return (
        <div className="flex flex-col gap-6">
            <section className="mb-2 flex  gap-3 pr-2">
                <ClipboardSignature className="h-6 w-6" />
                <h1 className="text-xl font-bold">
                    {task?.title.charAt(0).toUpperCase() + task?.title.slice(1)}
                </h1>
                {/**
                 * TODO: Some sort of columns dropdown to switch the task to another column if desired.
                 * Each dropdown item being a button with the column name and color.
                 */}
            </section>
            <section>
                <Description canUpdateTask={canUpdateTask} />
            </section>
            <section>
                <Subtasks />
            </section>
        </div>
    );
};
