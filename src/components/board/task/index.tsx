import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { BoardTask } from '@prisma/client';
import React from 'react';
import Link from 'next/link';
import { useBoardId } from 'store/kanban-store';
import dynamic from 'next/dynamic';
import { TaskOptionsDropdown } from './task-options-dropdown';
import { Dialog, DialogTrigger } from '@components/ui/dialog';
import { Grip } from 'lucide-react';
import { Button } from '@components/ui/button';
import { isPast, isToday, format } from 'date-fns';

const DueDateWarning = dynamic(
    () => import('./due-date-warning').then((mod) => mod.DueDateWarning),
    {
        ssr: false,
    }
);

const TaskDetailsDialogContent = dynamic(
    () =>
        import('@components/board/task-details-dialog-content').then(
            (mod) => mod.TaskDetailsDialogContent
        ),
    { ssr: false }
);

export interface TaskProps {
    task: BoardTask;
    color: string;
    isDragging?: boolean;
    listeners?: SyntheticListenerMap | undefined;
}
export const Task = ({ task, color, isDragging, listeners }: TaskProps) => {
    const { id, title, dueDate } = task;
    const boardId = useBoardId();

    const taskClasses = `flex bg-card border-l-2
        ${isDragging && 'opacity-50'}`;

    const dueDateToday = isToday(dueDate);
    const dueDateOverdue = isPast(dueDate);

    return (
        <div className={taskClasses} style={{ borderLeftColor: color }}>
            <Dialog modal>
                <DialogTrigger asChild>
                    <Link
                        className="flex flex-1 py-2"
                        href={`/board/[boardId]?boardId=${boardId}&taskId=${id}`}
                        as={`/board/${boardId}/task/${id}`}
                        scroll={false}
                        shallow
                    >
                        <div className="flex flex-col space-y-4 p-3">
                            <span>{title}</span>
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
                </DialogTrigger>
                <TaskDetailsDialogContent task={task} />
            </Dialog>
            <div className="flex flex-none flex-col items-center justify-around">
                <span className="pr-2" aria-roledescription="draggable">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-9 cursor-grab px-0 focus:cursor-grabbing"
                        {...listeners}
                    >
                        <Grip className="h-5 w-5" />
                    </Button>
                </span>
                <span className="mr-1">
                    <TaskOptionsDropdown task={task} />
                </span>
            </div>
        </div>
    );
};
