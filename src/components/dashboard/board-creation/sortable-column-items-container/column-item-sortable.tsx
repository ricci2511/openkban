import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { animateLayoutChanges } from '@lib/helpers';
import { CustomColumn } from '../custom-layout-section';
import { ColumnItem } from './column-item';

export interface ColumnItemSortableProps {
    column: CustomColumn;
    position: number;
    handleColumnDeletion: (id: string) => void;
}

export const ColumnItemSortable = ({
    column,
    position,
    handleColumnDeletion,
}: ColumnItemSortableProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ animateLayoutChanges, id: column.id });

    const style = {
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes}>
            <ColumnItem
                column={column}
                position={position}
                handleColumnDeletion={handleColumnDeletion}
                listeners={listeners}
            />
        </li>
    );
};
