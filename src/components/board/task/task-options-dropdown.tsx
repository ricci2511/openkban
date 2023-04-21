import { BoardTask } from '@prisma/client';
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { DeleteTaskAlertDialog } from './delete-task-alert-dialog';

interface TaskOptionsDropdownProps {
    task: BoardTask;
    startEditting: () => void;
}

export const TaskOptionsDropdown = ({
    task,
    startEditting,
}: TaskOptionsDropdownProps) => {
    const { id, title } = task;
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-9 px-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuLabel>{title} options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    aria-label={`Rename ${title} task`}
                    onClick={startEditting}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuDialogItem
                    open={isDeleting}
                    onOpenChange={setIsDeleting}
                    className="focus:bg-red-400 dark:focus:bg-red-600"
                    aria-label={`Delete ${title} task`}
                    trigger={
                        <>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </>
                    }
                    alert
                >
                    <DeleteTaskAlertDialog
                        taskId={id}
                        title={title}
                        closeAlert={() => setIsDeleting(false)}
                    />
                </DropdownMenuDialogItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
