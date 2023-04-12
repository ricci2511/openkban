import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardColumn, BoardTask } from '@prisma/client';
import { useTheme } from 'next-themes';
import { ColumnOptionsDropdown } from './column-options-dropdown';
import { TaskSortable } from '../task-sortable';

interface ColumnProps {
    column: BoardColumn;
    tasks: BoardTask[];
}

export const Column = ({ column, tasks }: ColumnProps) => {
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
            <li className="relative flex max-h-[95%] flex-col">
                <div
                    className="mb-4 flex items-center justify-between rounded-md border bg-base-200 p-2"
                    style={{ borderColor: color }}
                >
                    <h2 className="font-semibold uppercase" style={{ color }}>
                        {title}
                    </h2>
                    <ColumnOptionsDropdown column={column} />
                </div>
                {/* Might add a custom scrollbar for consistency between os's */}
                <ul
                    ref={setNodeRef}
                    className={`flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-scroll rounded-md p-2 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-slate-300'
                    }`}
                >
                    {tasks.map((task) => (
                        <TaskSortable key={task.id} task={task} color={color} />
                    ))}
                </ul>
            </li>
        </SortableContext>
    );
};
