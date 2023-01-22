import DropdownButton from '@components/ui/buttons/dropdown-button';
import useDeleteTask from '@hooks/use-delete-task';
import { BoardTask } from '@prisma/client';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React from 'react';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import { BoardColumnsColors } from 'types/board-types';

interface TaskProps {
    task: BoardTask;
    color: BoardColumnsColors;
}
const Task = ({ task, color }: TaskProps) => {
    const { id, title, dueDate } = task;
    const colorVariants = {
        primary: 'border-l-primary',
        secondary: 'border-l-secondary',
        accent: 'border-l-accent',
        success: 'border-l-success',
        error: 'border-l-error',
        warning: 'border-l-warning',
        info: 'border-l-info',
    };
    const { deleteTask, isLoading, error } = useDeleteTask(
        useRouter().query.bid as string
    );

    return (
        <li
            className={`relative gap-3 border-l-2 ${colorVariants[color]} bg-base-300`}
        >
            {isLoading && (
                <p className="absolute z-10 grid h-full w-full place-items-center bg-base-200 font-light transition-colors">
                    Deleting task...
                </p>
            )}
            <div className="flex flex-col gap-3 p-3">
                <span>{title}</span>
                <span className="text-xs font-extralight">
                    {`${dayjs()
                        .month(dueDate.getMonth())
                        .format('MMM')} ${dueDate.getDate()}`}
                </span>
                <DropdownButton
                    position="end"
                    labelIcon={<HiOutlineDotsHorizontal size={17} />}
                    labelClassName="cursor-pointer absolute bottom-2 right-2"
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
            </div>
        </li>
    );
};

export default Task;
