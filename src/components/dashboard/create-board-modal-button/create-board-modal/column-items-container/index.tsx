import {
    DndContext,
    DragEndEvent,
    DragOverlay,
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
import ColumnItem from './column-item';
import { createPortal } from 'react-dom';
import SortableColumnItem from './column-item/sortable-column';

interface ColumnItemsContainerProps {
    columns: CustomColumn[];
    setColumns: React.Dispatch<React.SetStateAction<CustomColumn[]>>;
    handleColumnDeletion: (id: string) => void;
}

const ColumnItemsContainer = ({
    columns,
    setColumns,
    handleColumnDeletion,
}: ColumnItemsContainerProps) => {
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
                    <SortableColumnItem
                        key={column.id}
                        column={column}
                        position={i + 1}
                        handleColumnDeletion={handleColumnDeletion}
                    />
                ))}
            </SortableContext>
            {typeof window !== 'undefined'
                ? createPortal(
                      <DragOverlay>
                          {activeId ? renderColumnItem() : null}
                      </DragOverlay>,
                      document.body
                  )
                : null}
        </DndContext>
    );
};

export default ColumnItemsContainer;
