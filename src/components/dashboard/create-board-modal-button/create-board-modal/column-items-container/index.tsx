import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import React, { useMemo } from 'react';
import { CustomColumn } from '../custom-layout-section';
import ColumnItem from './column-item';

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
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
            <SortableContext items={columnIds}>
                {columns.map(({ id, title }, i) => (
                    <ColumnItem
                        key={id}
                        id={id}
                        handleColumnDeletion={handleColumnDeletion}
                    >
                        <strong>{i + 1}. </strong>
                        {title}
                    </ColumnItem>
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default ColumnItemsContainer;
