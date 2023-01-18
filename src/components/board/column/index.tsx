import { BoardColumn, BoardTask } from '@prisma/client';
import React from 'react';

interface ColumnProps {
    column: BoardColumn & {
        tasks: BoardTask[];
    };
}
const Column = ({ column }: ColumnProps) => {
    const { title, tasks } = column;

    return (
        <li className="flex flex-col last:pr-4 last:sm:pr-6 last:lg:pr-8">
            <h2 className="mb-2 font-light">{title}</h2>
            <ul className="grid grid-flow-row grid-rows-1 gap-2">
                {tasks.map((task) => (
                    <li key={task.id} className="rounded-md bg-base-300 p-2">
                        {task.title}
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default Column;
