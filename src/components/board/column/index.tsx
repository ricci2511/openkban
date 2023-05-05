import React, { useState } from 'react';
import { BoardColumn } from '@prisma/client';
import { ColumnOptionsDropdown } from './column-options-dropdown';
import { ColumnTitleEditable } from './column-title-editable';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { ColumnColorPickerButton } from './column-color-picker-button';

export const Column = React.memo(({ column }: { column: BoardColumn }) => {
    const { id, ownerId, title, color } = column;

    const [isEditting, setIsEditting] = useState(false);
    // wether the current user can update column related data (title, color)
    const canUpdate = useCanPerformEntityAction('COLUMN', 'UPDATE', ownerId);

    const handleStartEditting = () => {
        if (!canUpdate) return;
        setIsEditting(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleStartEditting();
        }
    };

    return (
        <>
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
                            onClick={handleStartEditting}
                            onKeyDown={handleKeyDown}
                            className="cursor-pointer"
                            tabIndex={canUpdate ? 0 : -1}
                            aria-readonly={!canUpdate}
                        >
                            <h2 className="text-sm font-semibold uppercase sm:text-base">
                                {title}
                            </h2>
                        </div>
                        {canUpdate ? (
                            <ColumnColorPickerButton
                                columnId={id}
                                color={color}
                            />
                        ) : (
                            <div
                                className="ml-2 h-4 w-4 rounded-lg"
                                style={{ backgroundColor: color }}
                            />
                        )}
                    </div>
                    <ColumnOptionsDropdown column={column} />
                </div>
            )}
        </>
    );
});

Column.displayName = 'Column';
