import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import { columnTitle } from '@lib/schemas/board-schemas';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { DeleteColumnAlertDialog } from './delete-column-alert-dialog';
import dynamic from 'next/dynamic';
import { Button } from '@components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

const EditTitleDialog = dynamic(
    () =>
        import('@components/edit-title-dialog').then(
            (mod) => mod.EditTitleDialog
        ),
    { ssr: false }
);

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

    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-10 px-0">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuLabel>{title} options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuDialogItem
                    open={isEditting}
                    onOpenChange={setIsEditting}
                    trigger={
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
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
                    open={isDeleting}
                    onOpenChange={setIsDeleting}
                    className="focus:bg-red-400 dark:focus:bg-red-600"
                    trigger={
                        <>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </>
                    }
                    alert
                >
                    <DeleteColumnAlertDialog
                        columnId={id}
                        title={title}
                        closeAlert={() => setIsDeleting(false)}
                    />
                </DropdownMenuDialogItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
