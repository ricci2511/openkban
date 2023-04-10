import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { BoardTask } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { RxDragHandleDots2 } from 'react-icons/rx';
import Link from 'next/link';
import { Button } from 'react-daisyui';
import { useBoardId } from 'store/kanban-store';
import dynamic from 'next/dynamic';
import { TaskOptionsDropdown } from './task-options-dropdown';

// dynamically import the due date warning tooltip
const DueDateWarning = dynamic(
    () => import('./due-date-warning').then((mod) => mod.DueDateWarning),
    {
        ssr: false,
    }
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

    const taskClasses = `flex bg-base-200 border-l-2
        ${isDragging && 'opacity-50'}`;

    const dueDateToday = dayjs().isSame(dueDate, 'day');
    const dueDateOverdue = dayjs().isAfter(dueDate, 'day');

    return (
        <div className={taskClasses} style={{ borderLeftColor: color }}>
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
                        <span className="text-xs font-extralight">
                            {`${dayjs()
                                .month(dueDate.getMonth())
                                .format('MMM')} ${dueDate.getDate()}`}
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
            <div className="flex flex-none flex-col items-center justify-around">
                <span className="pr-1" aria-roledescription="draggable">
                    <Button
                        color="ghost"
                        size="sm"
                        className="cursor-grab focus:cursor-grabbing"
                        {...listeners}
                    >
                        <RxDragHandleDots2 size={20} />
                    </Button>
                </span>
                <span className="">
                    <TaskOptionsDropdown task={task} />
                </span>
            </div>
        </div>
    );
};
