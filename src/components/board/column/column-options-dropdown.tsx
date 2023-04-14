import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import { RxDotsHorizontal, RxPencil1, RxTrash } from 'react-icons/rx';
import { columnTitle } from '@lib/schemas/board-schemas';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { EditTitleDialog } from '@components/edit-title-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { DeleteColumnAlertDialog } from './delete-column-alert-dialog';

interface ColumnOptionsDropdownProps {
    column: BoardColumn;
}

export const ColumnOptionsDropdown = ({
    column,
}: ColumnOptionsDropdownProps) => {
    const { id, title } = column;

    const [isEditting, setIsEditting] = useState(false);
    const stopEditting = () => setIsEditting(false);
    const updateColumnMutation = useUpdateColumn(
        isEditting ? stopEditting : undefined
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="btn-ghost btn-xs btn">
                <RxDotsHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuLabel>{title} options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuDialogItem
                    open={isEditting}
                    onOpenChange={setIsEditting}
                    trigger={
                        <>
                            <RxPencil1 className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                        </>
                    }
                >
                    <EditTitleDialog
                        entity={column}
                        updateMutation={updateColumnMutation}
                        zodString={columnTitle}
                        name="column"
                        oldTitle={title}
                        closeDialog={stopEditting}
                    />
                </DropdownMenuDialogItem>
                <DropdownMenuDialogItem
                    className="focus:bg-red-400 dark:focus:bg-red-600"
                    trigger={
                        <>
                            <RxTrash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </>
                    }
                >
                    <DeleteColumnAlertDialog columnId={id} title={title} />
                </DropdownMenuDialogItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
