import React, { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardColumn, BoardTask } from '@prisma/client';
import { ColumnOptionsDropdown } from './column-options-dropdown';
import { TaskSortable } from '../task-sortable';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { ColorPickerPopover } from '@components/color-picker-popover';
import { EditableTitleInput } from './editable-title-input';

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

    const { mutate: updateColumn, isLoading } = useUpdateColumn();
    const handleColorChange = (newColor: string) => {
        // prevent updating if color is the same or if already mutating
        if (color === newColor || isLoading) return;
        updateColumn({
            id,
            color: newColor,
        });
    };

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [isEditting, setIsEditting] = useState(false);

    return (
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="relative mt-1 flex h-[calc(100vh-225px)] flex-col">
                {isEditting ? (
                    <div className="mb-4 rounded-md border">
                        <EditableTitleInput
                            columnId={id}
                            title={title}
                            stopEditting={() => setIsEditting(false)}
                        />
                    </div>
                ) : (
                    <div
                        className="mb-4 flex items-center justify-between rounded-md border bg-secondary p-2"
                        style={{ borderColor: color }}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                onClick={() => setIsEditting(true)}
                                className="cursor-pointer"
                            >
                                <h2 className="text-sm font-semibold uppercase sm:text-base">
                                    {title}
                                </h2>
                            </div>
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
                )}
                {/* Might add a custom scrollbar for consistency between os's */}
                <ul
                    ref={setNodeRef}
                    className="flex h-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-scroll rounded-md bg-muted p-2"
                >
                    {tasks.map((task) => (
                        <TaskSortable key={task.id} task={task} color={color} />
                    ))}
                </ul>
            </li>
        </SortableContext>
    );
};
