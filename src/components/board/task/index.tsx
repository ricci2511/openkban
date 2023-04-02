import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { BoardTask } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { RxDragHandleDots2 } from 'react-icons/rx';
import Link from 'next/link';
import { Button } from 'react-daisyui';
import TaskOptionsDropdown from './task-options-dropdown';
import { useBoardId } from 'store/kanban-store';
import dynamic from 'next/dynamic';

// dynamically import the due date warning tooltip
const DueDateWarningTooltip = dynamic(
    () => import('./due-date-warning-tooltip'),
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
const Task = ({ task, color, isDragging, listeners }: TaskProps) => {
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
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-extralight">
                            {`${dayjs()
                                .month(dueDate.getMonth())
                                .format('MMM')} ${dueDate.getDate()}`}
                        </span>
                        {(dueDateToday || dueDateOverdue) && (
                            <DueDateWarningTooltip
                                today={dueDateToday}
                                overdue={dueDateOverdue}
                            />
                        )}
                    </div>
                </div>
            </Link>
            <div className="flex flex-none flex-col items-center space-y-6 py-2">
                <span className="pr-1 pt-4" aria-roledescription="draggable">
                    <Button color="ghost" size="xs">
                        <RxDragHandleDots2
                            size={20}
                            className="cursor-grab focus:cursor-grabbing"
                            {...listeners}
                        />
                    </Button>
                </span>
                <span className="pr-1">
                    <TaskOptionsDropdown task={task} />
                </span>
            </div>
        </div>
    );
};

export default Task;
