import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react';
import { CustomColumn } from '../custom-layout-section';
import { ColumnItem } from './column-item';
import { ColumnItemSortable } from './column-item-sortable';
import { DndDragOverlay } from '@components/dnd-drag-overlay';

interface SortableColumnItemsContainerProps {
    columns: CustomColumn[];
    setColumns: React.Dispatch<React.SetStateAction<CustomColumn[]>>;
    handleColumnDeletion: (id: string) => void;
}

export const SortableColumnItemsContainer = ({
    columns,
    setColumns,
    handleColumnDeletion,
}: SortableColumnItemsContainerProps) => {
    const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over !== null && active.id !== over.id) {
            setColumns((columns) => {
                const oldIndex = columns.findIndex(
                    (col) => col.id === active.id
                );
                const newIndex = columns.findIndex((col) => col.id === over.id);

                return arrayMove(columns, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    const renderColumnItem = () => {
        if (!activeId) return null;
        let position = 1;
        const column = columns.find((col, i) => {
            if (col.id === activeId) {
                position = i + 1;
                return true;
            }
        });
        if (!column) return null;
        return (
            <ColumnItem
                column={column}
                position={position}
                handleColumnDeletion={handleColumnDeletion}
            />
        );
    };

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <SortableContext items={columnIds}>
                {columns.map((column, i) => (
                    <ColumnItemSortable
                        key={column.id}
                        column={column}
                        position={i + 1}
                        handleColumnDeletion={handleColumnDeletion}
                    />
                ))}
            </SortableContext>
            <DndDragOverlay
                activeId={activeId}
                renderMethod={renderColumnItem}
            />
        </DndContext>
    );
};
