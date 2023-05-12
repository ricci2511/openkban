import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import React, { useState } from 'react';
import Link from 'next/link';
import { getBoardId, useColumns } from 'store/kanban-store';
import dynamic from 'next/dynamic';
import { TaskOptionsDropdown } from './task-options-dropdown';
import { Dialog, DialogTrigger } from '@components/ui/dialog';
import { Grip, Pencil } from 'lucide-react';
import { Button } from '@components/ui/button';
import { isPast, isToday, format } from 'date-fns';
import { TaskTitleEditable } from './task-title-editable';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { cn } from '@lib/helpers';
import { ClientTask } from 'types/board-types';
import { TaskDetailsDialog } from '../task-details-dialog';

const DueDateWarning = dynamic(
    () => import('./due-date-warning').then((mod) => mod.DueDateWarning),
    {
        ssr: false,
    }
);

export interface TaskProps {
    task: ClientTask;
    isDragging?: boolean;
    listeners?: SyntheticListenerMap | undefined;
}

export const Task = React.memo(({ task, isDragging, listeners }: TaskProps) => {
    const { id, ownerId, title, dueDate } = task;
    const color = useColumns().find((c) => c.id === task.columnId)?.color;
    const boardId = getBoardId();

    const dueDateToday = isToday(dueDate);
    const dueDateOverdue = isPast(dueDate) && !dueDateToday;

    const [isEditting, setIsEditting] = useState(false);
    // wether the current user can update task related data (title)
    const canUpdate = useCanPerformEntityAction('TASK', 'UPDATE', ownerId);

    const handleStartEditting = () => {
        if (!canUpdate) return;
        setIsEditting(true);
    };

    return (
        <div
            className={cn(
                'group flex min-h-[100px] border-l-2 bg-card',
                isDragging && 'opacity-50'
            )}
            style={{ borderLeftColor: color }}
        >
            {isEditting ? (
                <div className="my-auto w-full px-3">
                    <TaskTitleEditable
                        id={id}
                        title={title}
                        stopEditting={() => setIsEditting(false)}
                    />
                </div>
            ) : (
                <>
                    <TaskDetailsDialog task={task}>
                        <Link
                            className="flex flex-1 py-2"
                            href={`/board/[boardId]?boardId=${boardId}&taskId=${id}`}
                            as={`/board/${boardId}/task/${id}`}
                            scroll={false}
                            shallow
                        >
                            <div className="flex flex-col space-y-4 p-3">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm">{title}</span>
                                    {canUpdate && (
                                        <Button
                                            variant="secondary"
                                            size="xs"
                                            className="opacity-0 transition-opacity duration-150 ease-in group-focus-within:opacity-100 group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleStartEditting();
                                            }}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-light">
                                        {`${format(
                                            dueDate,
                                            'MMM'
                                        )} ${dueDate.getDate()}`}
                                    </span>
                                </div>
                                {(dueDateToday || dueDateOverdue) && (
                                    <DueDateWarning
                                        today={dueDateToday}
                                        overdue={dueDateOverdue}
                                    />
                                )}
                            </div>
                        </Link>
                    </TaskDetailsDialog>
                    <div className="flex flex-none flex-col items-center justify-around">
                        <span className="pr-2" aria-roledescription="draggable">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-9 cursor-grab px-0"
                                {...listeners}
                            >
                                <Grip className="h-5 w-5" />
                            </Button>
                        </span>
                        <span className="mr-1">
                            <TaskOptionsDropdown
                                task={task}
                                handleStartEditting={handleStartEditting}
                            />
                        </span>
                    </div>
                </>
            )}
        </div>
    );
});

Task.displayName = 'Task';
