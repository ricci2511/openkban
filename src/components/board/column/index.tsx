import React, { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardColumn, BoardTask } from '@prisma/client';
import { useTheme } from 'next-themes';
import { ColumnOptionsDropdown } from './column-options-dropdown';
import { TaskSortable } from '../task-sortable';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { ColorPickerPopover } from '@components/color-picker-popover';

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

    const { mutate: updateCol, isLoading } = useUpdateColumn();
    const handleColorChange = (newColor: string) => {
        // prevent updating if color is the same or if already mutating
        if (color === newColor || isLoading) return;
        updateCol({
            id,
            color: newColor,
        });
    };

    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="relative flex h-[calc(100vh-225px)] flex-col">
                <div
                    className="mb-4 flex items-center justify-between rounded-md border bg-base-200 p-2"
                    style={{ borderColor: color }}
                >
                    <div className="flex items-center gap-2">
                        <h2
                            className="font-semibold uppercase"
                            style={{ color }}
                        >
                            {title}
                        </h2>
                        <ColorPickerPopover
                            isOpen={colorPickerOpen}
                            toggle={setColorPickerOpen}
                            color={color}
                            changeColor={handleColorChange}
                            className="absolute top-9 -left-7"
                        />
                    </div>
                    <ColumnOptionsDropdown column={column} />
                </div>
                {/* Might add a custom scrollbar for consistency between os's */}
                <ul
                    ref={setNodeRef}
                    className={`flex h-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-scroll rounded-md p-2 ${
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
