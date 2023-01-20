import { BoardColumn, BoardTask } from '@prisma/client';
import React from 'react';
import Task from '../task';

interface ColumnProps {
    column: BoardColumn & {
        tasks: BoardTask[];
    };
}
const Column = ({ column }: ColumnProps) => {
    const { title, tasks, color } = column;

    return (
        <li className="flex flex-col last:pr-4 last:sm:pr-6 last:lg:pr-8">
            <h2
                className={`mb-4 rounded-md border border-${color} p-2 text-${color} font-semibold uppercase`}
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
