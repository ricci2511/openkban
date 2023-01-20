import React from 'react';
import Task from '../task';
import { BoardColumnWithTasks } from 'types/board-types';

interface ColumnProps {
    column: BoardColumnWithTasks;
}
const Column = ({ column }: ColumnProps) => {
    const { title, tasks, color } = column;

    // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
    const colorVariants = {
        primary: 'border-primary text-primary',
        secondary: 'border-secondary text-secondary',
        accent: 'border-accent text-accent',
        success: 'border-success text-success',
        error: 'border-error text-error',
        warning: 'border-warning text-warning',
        info: 'border-info text-info',
    };

    return (
        <li className="flex flex-col last:pr-4 last:sm:pr-6 last:lg:pr-8">
            <h2
                className={`mb-4 rounded-md border p-2 font-semibold uppercase ${colorVariants[color]}`}
            >
                {title}
            </h2>
            <ul className="grid grid-flow-row grid-rows-1 gap-2">
                {tasks.map((task) => (
                    <Task key={task.id} task={task} color={color} />
                ))}
            </ul>
        </li>
    );
};

export default Column;
