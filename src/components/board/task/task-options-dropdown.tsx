import { BoardTask } from '@prisma/client';
import React, { useState } from 'react';
import { taskTitle } from '@lib/schemas/board-schemas';
import {
    useDeleteTask,
    useUpdateTask,
} from '@hooks/mutations/use-task-mutations';
import { RxDotsHorizontal, RxPencil1, RxTrash } from 'react-icons/rx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import dynamic from 'next/dynamic';

const EditTitleDialog = dynamic(
    () =>
        import('@components/edit-title-dialog').then(
            (mod) => mod.EditTitleDialog
        ),
    { ssr: false }
);

interface TaskOptionsDropdownProps {
    task: BoardTask;
}

export const TaskOptionsDropdown = ({ task }: TaskOptionsDropdownProps) => {
    const { id, title } = task;
    const { mutate: deleteTask, isLoading } = useDeleteTask();

    const [isEditting, setIsEditting] = useState(false);
    const stopEditting = () => setIsEditting(false);
    const updateTaskMutation = useUpdateTask(stopEditting);

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
                    aria-label={`Rename ${title} task`}
                >
                    <EditTitleDialog
                        entity={task}
                        updateMutation={updateTaskMutation}
                        zodString={taskTitle}
                        name="task"
                        oldTitle={title}
                        closeDialog={stopEditting}
                    />
                </DropdownMenuDialogItem>
                <DropdownMenuItem
                    className="focus:bg-red-400 dark:focus:bg-red-600"
                    aria-label={`Delete ${title} task`}
                    onClick={() => deleteTask({ id })}
                >
                    <RxTrash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
