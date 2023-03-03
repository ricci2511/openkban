import DropdownButton from '@components/ui/buttons/dropdown-button';
import useDeleteTask from '@hooks/use-delete-task';
import { BoardTask } from '@prisma/client';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import TaskEditTitleModal from './task-edit-title-modal';

interface TaskOptionsDropdownProps {
    task: BoardTask;
}

const TaskOptionsDropdown = ({ task }: TaskOptionsDropdownProps) => {
    const { deleteTask, isLoading: deleteLoading } = useDeleteTask();

    const [isEditting, setIsEditting] = useState(false);
    const toggleEditting = () => setIsEditting(!isEditting);

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
                            ariaLabel={`Rename ${task.title} task`}
                            onClick={toggleEditting}
                        />
                    </li>
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<HiTrash size={18} />}
                            loading={deleteLoading}
                            ariaLabel={`Delete ${task.title} task`}
                            onClick={() => deleteTask({ id: task.id })}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
            {isEditting && (
                <TaskEditTitleModal
                    task={task}
                    isEditting={isEditting}
                    toggleEditting={toggleEditting}
                />
            )}
        </>
    );
};

export default TaskOptionsDropdown;