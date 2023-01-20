import { BoardTask } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

interface TaskProps {
    task: BoardTask;
    color: string;
}
const Task = ({ task, color }: TaskProps) => {
    const { title, dueDate } = task;
    return (
        <li
            className={`relative flex flex-col gap-3 border-l-2 border-l-${color} bg-base-300 p-3`}
        >
            <span>{title}</span>
            <span className="text-xs font-extralight">
                {`${dayjs()
                    .month(dueDate.getMonth())
                    .format('MMM')} ${dueDate.getDate()}`}
            </span>
            {/* TODO: dropdown button */}
            <button className="absolute bottom-2 right-2">
                <HiOutlineDotsHorizontal size={17} />
            </button>
        </li>
    );
};

export default Task;
