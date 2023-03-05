import React, { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from '../task/sortable-task';
import { BoardColumn, BoardTask } from '@prisma/client';
import { useTheme } from 'next-themes';
import ColumnOptionsDropdown from './column-options-dropdown';

interface ColumnProps {
    column: BoardColumn;
    tasks: BoardTask[];
}
const Column = ({ column, tasks }: ColumnProps) => {
    const { id, title, color } = column;
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
    // each column is a droppable area
    const { setNodeRef } = useDroppable({
        id,
    });

    const { theme } = useTheme();

    return (
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="flex h-full flex-col">
                <div
                    className="mb-4 flex items-center justify-between rounded-md border p-2"
                    style={{ borderColor: color }}
                >
                    <h2 className="font-semibold uppercase" style={{ color }}>
                        {title}
                    </h2>
                    <ColumnOptionsDropdown column={column} />
                </div>
                <div
                    className={`h-[calc(100vh-250px)] overflow-y-auto overflow-x-hidden rounded-lg
                        ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-300'}`}
                >
                    <ul
                        ref={setNodeRef}
                        className="grid grid-flow-row grid-rows-1 gap-3 p-2.5"
                    >
                        {tasks.map((task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                color={color}
                            />
                        ))}
                    </ul>
                </div>
            </li>
        </SortableContext>
    );
};

export default Column;
