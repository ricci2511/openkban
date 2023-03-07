import DropdownButton from '@components/ui/buttons/dropdown-button';
import useDeleteTask from '@hooks/use-delete-task';
import { BoardTask } from '@prisma/client';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import { taskTitle } from '@lib/schemas/board-schemas';
import useUpdateTask from '@hooks/use-update-task';
import EditTitleModal from '@components/ui/form/edit-title-modal';

interface TaskOptionsDropdownProps {
    task: BoardTask;
}

const TaskOptionsDropdown = ({ task }: TaskOptionsDropdownProps) => {
    const { id, title } = task;

    const { deleteTask, isLoading: deleteLoading } = useDeleteTask();

    const [isEditting, setIsEditting] = useState(false);
    const stopEditting = () => setIsEditting(false);
    const updateTaskMutation = useUpdateTask(stopEditting);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" size="xs">
                    <HiOutlineDotsHorizontal size={18} />
                </Button>
                <Dropdown.Menu className="w-36 gap-1">
                    <li>
                        <DropdownButton
                            text="Rename"
                            startIcon={<HiPencil size={18} />}
                            ariaLabel={`Rename ${title} task`}
                            onClick={() => setIsEditting(true)}
                        />
                    </li>
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<HiTrash size={18} />}
                            loading={deleteLoading}
                            ariaLabel={`Delete ${title} task`}
                            onClick={() => deleteTask({ id })}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
            {isEditting && (
                <EditTitleModal
                    entity={task}
                    updateMutation={updateTaskMutation}
                    zodString={taskTitle}
                    name="task"
                    oldTitle={title}
                    open={isEditting}
                    closeDialog={stopEditting}
                />
            )}
        </>
    );
};

export default TaskOptionsDropdown;
