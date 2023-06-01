import React from 'react';
import { useCurrentTask, useMyRole } from 'store/kanban-store';
import { Description } from './description';
import { Subtasks } from './subtasks';
import { ClipboardSignature } from 'lucide-react';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { TaskAssignee } from './task-assignee';
import { AssignUserButton } from './assign-user-button';

export const TaskDetails = () => {
    const task = useCurrentTask()!;
    const canUpdateTask = useCanPerformEntityAction(
        'TASK',
        'UPDATE',
        task.ownerId
    );
    const myRole = useMyRole();

    return (
        <div className="flex flex-col gap-6">
            <section className="mb-1.5 flex flex-col gap-4 pr-2">
                <div className="flex gap-3">
                    <ClipboardSignature className="h-6 w-6" />
                    <h1 className="text-xl font-bold">
                        {task?.title.charAt(0).toUpperCase() +
                            task?.title.slice(1)}
                    </h1>
                </div>
                <div className="ml-9 flex flex-col gap-1.5">
                    <span className="text-sm font-semibold">Assignees:</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {!!task.assignees.length && (
                            <ul className="flex flex-wrap items-center gap-1">
                                {task.assignees.map((boardUserId) => (
                                    <li key={boardUserId} className="pt-1">
                                        <TaskAssignee
                                            boardUserId={boardUserId}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!task.assignees.length && (
                            <p className="text-xs text-muted-foreground">
                                No assignees
                            </p>
                        )}
                        {myRole !== 'VIEWER' && <AssignUserButton />}
                    </div>
                </div>
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
