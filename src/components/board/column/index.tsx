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
        <div className="grid grid-flow-row grid-rows-1 gap-2">
            <h2 className="mb-2 font-light">{title}</h2>
            {tasks.map((task) => (
                <div key={task.id} className="rounded-md bg-base-300 p-2">
                    {task.title}
                </div>
            ))}
        </div>
    );
};

export default Column;
