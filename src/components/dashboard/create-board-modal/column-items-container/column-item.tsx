import React, { PropsWithChildren } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    AnimateLayoutChanges,
    defaultAnimateLayoutChanges,
    useSortable,
} from '@dnd-kit/sortable';
import { RiCloseFill } from 'react-icons/ri';

// to animate layout changes, for example when an item is removed
const animateLayoutChanges = (args: Parameters<AnimateLayoutChanges>[0]) => {
    const { isSorting, wasDragging } = args;

    if (isSorting || wasDragging) {
        return defaultAnimateLayoutChanges(args);
    }

    return true;
};

interface ColumnItemProps extends PropsWithChildren {
    id: UniqueIdentifier;
    handleColumnDeletion: (id: string) => void;
}

const ColumnItem = ({
    id,
    handleColumnDeletion,
    children,
}: ColumnItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ animateLayoutChanges, id });

    const style = {
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes}>
            <div className="btn-xs btn flex w-full cursor-default items-center justify-between gap-3 p-0">
                <div
                    className="grid h-full flex-1 cursor-grab items-center truncate"
                    {...listeners}
                >
                    <span className="ml-3 justify-self-start text-xs sm:text-sm">
                        {children}
                    </span>
                </div>
                <button
                    type="button"
                    className="btn-error btn-xs btn h-full rounded-md p-1"
                    onClick={() => handleColumnDeletion(id as string)}
                    aria-label="Delete column item"
                >
                    <RiCloseFill />
                </button>
            </div>
        </li>
    );
};

export default ColumnItem;
