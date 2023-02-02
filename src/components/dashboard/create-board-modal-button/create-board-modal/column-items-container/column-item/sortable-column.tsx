import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { CustomColumn } from '../../custom-layout-section';
import ColumnItem from '.';
import { animateLayoutChanges } from '@lib/helpers';

export interface SortableColumnItemProps {
    column: CustomColumn;
    position: number;
    handleColumnDeletion: (id: string) => void;
}

const SortableColumnItem = ({
    column,
    position,
    handleColumnDeletion,
}: SortableColumnItemProps) => {
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

export default SortableColumnItem;
