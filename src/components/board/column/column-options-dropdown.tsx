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
import { Button } from '@components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';

interface ColumnOptionsDropdownProps {
    column: BoardColumn;
}

export const ColumnOptionsDropdown = ({
    column,
}: ColumnOptionsDropdownProps) => {
    const { id, title } = column;
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuLabel>{title} options</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
