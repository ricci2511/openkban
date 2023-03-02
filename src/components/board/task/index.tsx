import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { BoardTask } from '@prisma/client';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import React from 'react';
import { RxDragHandleDots2 } from 'react-icons/rx';
import Link from 'next/link';
import useKanbanStore from 'store/kanban-store';
import { Button, Dropdown } from 'react-daisyui';
import TaskOptionsDropdown from './task-options-dropdown';

export interface TaskProps {
    task: BoardTask;
    color: string;
    isDragging?: boolean;
    listeners?: SyntheticListenerMap | undefined;
}
const Task = ({ task, color, isDragging, listeners }: TaskProps) => {
    const { id, title, dueDate } = task;
    const boardId = useKanbanStore((state) => state.boardId);

    const taskClasses = cx(
        'flex bg-base-200 border-l-2',
        isDragging ? 'opacity-50' : null
    );

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
                    <span className="text-xs font-extralight">
                        {`${dayjs()
                            .month(dueDate.getMonth())
                            .format('MMM')} ${dueDate.getDate()}`}
                    </span>
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
