import DropdownButton from '@components/ui/buttons/dropdown-button';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import useDeleteTask from '@hooks/use-delete-task';
import { BoardTask } from '@prisma/client';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import React from 'react';
import { HiOutlineDotsHorizontal, HiTrash } from 'react-icons/hi';

export interface TaskProps {
    task: BoardTask;
    color: string;
    isDragging?: boolean;
    listeners?: SyntheticListenerMap | undefined;
}
const Task = ({ task, color, isDragging, listeners }: TaskProps) => {
    const { id, title, dueDate } = task;
    const { deleteTask, isLoading, error } = useDeleteTask();

    const taskClasses = cx(
        'flex flex-col bg-base-200 border-l-2',
        isDragging ? 'opacity-50' : null
    );

    return (
        <div className={taskClasses} style={{ borderLeftColor: color }}>
            <div
                className="flex flex-1 cursor-grab flex-col space-y-4 p-3"
                aria-roledescription="draggable"
                {...listeners}
            >
                <span>{title}</span>
                <span className="text-xs font-extralight">
                    {`${dayjs()
                        .month(dueDate.getMonth())
                        .format('MMM')} ${dueDate.getDate()}`}
                </span>
            </div>
            <div className="flex flex-none">
                <span
                    className="w-full cursor-grab"
                    aria-roledescription="draggable"
                    {...listeners}
                ></span>
                <span className="self-end pr-2 pb-1">
                    <DropdownButton
                        position="end"
                        labelIcon={<HiOutlineDotsHorizontal size={17} />}
                        labelClassName="cursor-pointer"
                        contentClassName="rounded-box w-36 gap-2 bg-base-200 p-2 shadow"
                    >
                        <li>
                            <button
                                type="button"
                                aria-label="Delete task"
                                className="btn-outline btn-error btn-md font-medium"
                                onClick={() => deleteTask({ id })}
                            >
                                <HiTrash size={18} />
                                Delete
                            </button>
                        </li>
                    </DropdownButton>
                </span>
            </div>
        </div>
    );
};

export default Task;
