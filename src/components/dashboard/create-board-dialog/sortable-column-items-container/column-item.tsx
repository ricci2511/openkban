import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { ColumnItemSortableProps } from './column-item-sortable';
import { Button } from '@components/ui/button';

interface ColumnItemProps extends ColumnItemSortableProps {
    listeners?: SyntheticListenerMap | undefined;
}

export const ColumnItem = ({
    column,
    position,
    handleColumnDeletion,
    listeners,
}: ColumnItemProps) => {
    return (
        <div className="flex w-full cursor-default items-center justify-between gap-3 rounded-lg bg-muted p-0">
            <div
                className="grid h-full flex-1 cursor-grab items-center truncate"
                aria-roledescription="draggable"
                {...listeners}
            >
                <span className="ml-3 justify-self-start text-xs sm:text-sm">
                    <strong>{position}. </strong>
                    {column.title}
                </span>
            </div>
            <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-full rounded-lg p-1"
                onClick={() => handleColumnDeletion(column.id as string)}
                aria-label="Delete column item"
            >
                <RiCloseFill />
            </Button>
        </div>
    );
};
