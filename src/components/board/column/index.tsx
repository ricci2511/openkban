import React, { useMemo, useState } from 'react';
import { BoardColumnWithTasks } from 'types/board-types';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from '../task/sortable-task';

interface ColumnProps {
    column: BoardColumnWithTasks;
}
const Column = ({ column }: ColumnProps) => {
    const { id, title, tasks, color } = column;
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
    // each column is a droppable area
    const { setNodeRef } = useDroppable({
        id,
    });

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
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="flex h-full flex-col last:pr-4 last:sm:pr-6 last:lg:pr-8">
                <h2
                    className={`mb-4 rounded-md border p-2 font-semibold uppercase ${colorVariants[color]}`}
                >
                    {title}
                </h2>
                <ul
                    ref={setNodeRef}
                    className="grid grid-flow-row grid-rows-1 gap-2"
                >
                    {tasks.map((task) => (
                        <SortableTask key={task.id} task={task} color={color} />
                    ))}
                </ul>
            </li>
        </SortableContext>
    );
};

export default Column;
