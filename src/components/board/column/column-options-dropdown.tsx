import { BoardColumn } from '@prisma/client';
import React, { Suspense, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@components/ui/loading-spinner';

const DeleteColumnAlertDialog = dynamic(
    () =>
        import('./delete-column-alert-dialog').then(
            (mod) => mod.DeleteColumnAlertDialog
        ),
    {
        ssr: false,
    }
);

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
                <DropdownMenuLabel>Column options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuDialogItem
                    open={isDeleting}
                    onOpenChange={setIsDeleting}
                    trigger={
                        <>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </>
                    }
                    alert
                    destructive
                >
                    <Suspense fallback={<LoadingSpinner centered />}>
                        <DeleteColumnAlertDialog
                            columnId={id}
                            title={title}
                            closeAlert={() => setIsDeleting(false)}
                        />
                    </Suspense>
                </DropdownMenuDialogItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
