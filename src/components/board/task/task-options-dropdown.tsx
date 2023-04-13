import { BoardTask } from '@prisma/client';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { taskTitle } from '@lib/schemas/board-schemas';
import {
    useDeleteTask,
    useUpdateTask,
} from '@hooks/mutations/use-task-mutations';
import { DropdownButton } from '@components/ui/dropdown-button';
import { Dialog, DialogTrigger } from '@components/ui/dialog';
import { EditTitleDialog } from '@components/edit-title-dialog';
import { RxDotsHorizontal, RxPencil1, RxTrash } from 'react-icons/rx';

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
        <>
            <Dropdown vertical="end">
                <Button color="ghost" size="xs">
                    <RxDotsHorizontal size={18} />
                </Button>
                <Dropdown.Menu className="w-36 gap-1">
                    <Dialog open={isEditting} onOpenChange={setIsEditting}>
                        <DialogTrigger asChild>
                            <li>
                                <DropdownButton
                                    text="Rename"
                                    startIcon={<RxPencil1 size={18} />}
                                    aria-label={`Rename ${title} task`}
                                />
                            </li>
                        </DialogTrigger>
                        <EditTitleDialog
                            entity={task}
                            updateMutation={updateTaskMutation}
                            zodString={taskTitle}
                            name="task"
                            oldTitle={title}
                            closeDialog={stopEditting}
                        />
                    </Dialog>
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<RxTrash size={18} />}
                            loading={isLoading}
                            aria-label={`Delete ${title} task`}
                            onClick={() => deleteTask({ id })}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};
