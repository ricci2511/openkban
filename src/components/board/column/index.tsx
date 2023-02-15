import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from '../task/sortable-task';
import PopoverPicker from '@components/ui/color-picker/popover-picker';
import { trpc } from '@lib/trpc';
import useKanbanStore from 'store/kanban-store';
import { BoardColumn, BoardTask } from '@prisma/client';

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

    const { mutate: updateColumn, error } =
        trpc.boardColumnRouter.update.useMutation();

    const updateColor = useKanbanStore((state) => state.updateColor);
    const handleColorChange = (newColor: string) => {
        if (color === newColor) return;
        // update column color in kanban store and db
        updateColor(id, newColor);
        updateColumn({
            id,
            color: newColor,
        });
    };

    return (
        <SortableContext
            id={id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <li className="flex flex-col">
                <div
                    className="mb-4 flex items-center justify-between rounded-md border p-2"
                    style={{ borderColor: color }}
                >
                    <h2 className="font-semibold uppercase" style={{ color }}>
                        {title}
                    </h2>
                    <PopoverPicker
                        color={color}
                        changeColor={handleColorChange}
                    />
                </div>
                <ul
                    ref={setNodeRef}
                    className="mb-4 grid grid-flow-row grid-rows-1 gap-2"
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
