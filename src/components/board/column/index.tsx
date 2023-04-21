import React, { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardColumn, BoardTask } from '@prisma/client';
import { ColumnOptionsDropdown } from './column-options-dropdown';
import { TaskSortable } from '../task-sortable';
import { Button } from '@components/ui/button';
import { ColumnColorPicker } from './column-color-picker';
import dynamic from 'next/dynamic';

const ColumnTitleEditable = dynamic(
    () =>
        import('./column-title-editable').then(
            (mod) => mod.ColumnTitleEditable
        ),
    {
        ssr: false,
    }
);

interface ColumnProps {
    column: BoardColumn;
    tasks: BoardTask[];
    position: number;
}

export const Column = ({ column, tasks, position }: ColumnProps) => {
    const { id, title, color } = column;
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
    // each column is a droppable area
    const { setNodeRef } = useDroppable({
        id,
    });

    // column title editting state
    const [isEditting, setIsEditting] = useState(false);
    // column color picker state
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="relative mt-1 flex h-[calc(100vh-225px)] flex-col gap-4">
                {isEditting ? (
                    <div className="mt-0.5">
                        <ColumnTitleEditable
                            id={id}
                            title={title}
                            stopEditting={() => setIsEditting(false)}
                        />
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-between rounded-md border bg-secondary p-2"
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
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                onClick={() => setColorPickerOpen(true)}
                                title="Modifty the color for your column"
                            >
                                <div
                                    className="h-4 w-4 rounded-lg"
                                    style={{ backgroundColor: color }}
                                />
                            </Button>
                            {colorPickerOpen && (
                                <ColumnColorPicker
                                    id={id}
                                    color={color}
                                    toggle={setColorPickerOpen}
                                    // color picker on the first column should be centered to avoid it being cut off
                                    align={position === 0 ? 'center' : 'end'}
                                />
                            )}
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
