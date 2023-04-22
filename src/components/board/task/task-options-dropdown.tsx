import { BoardTask } from '@prisma/client';
import React, { Suspense, useState } from 'react';
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
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@components/ui/loading-spinner';

const DeleteTaskAlertDialog = dynamic(
    () =>
        import('./delete-task-alert-dialog').then(
            (mod) => mod.DeleteTaskAlertDialog
        ),
    {
        ssr: false,
    }
);

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
                <DropdownMenuLabel>Task options</DropdownMenuLabel>
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
                    aria-label={`Delete ${title} task`}
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
                        <DeleteTaskAlertDialog
                            taskId={id}
                            title={title}
                            closeAlert={() => setIsDeleting(false)}
                        />
                    </Suspense>
                </DropdownMenuDialogItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
