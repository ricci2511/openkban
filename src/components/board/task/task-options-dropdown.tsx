import DropdownButton from '@components/ui/buttons/dropdown-button';
import useDeleteTask from '@hooks/use-delete-task';
import { trpc } from '@lib/trpc';
import { BoardTask } from '@prisma/client';
import React from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';

interface TaskOptionsDropdownProps {
    task: BoardTask;
}

const TaskOptionsDropdown = ({ task }: TaskOptionsDropdownProps) => {
    const {
        deleteTask,
        isLoading: deleteLoading,
        error: deleteErr,
    } = useDeleteTask();

    const {
        mutate: updateTask,
        isLoading: updateLoading,
        error: updateErr,
    } = trpc.boardTaskRouter.update.useMutation();

    return (
        <Dropdown vertical="end">
            <Button color="ghost" size="xs">
                <HiOutlineDotsHorizontal size={18} />
            </Button>
            <Dropdown.Menu className="w-36 gap-1">
                <li>
                    <DropdownButton
                        text="Rename"
                        startIcon={<HiPencil size={18} />}
                        loading={updateLoading}
                        ariaLabel={`Rename ${task.title} task`}
                        onClick={() => console.log('rename task')}
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
    );
};

export default TaskOptionsDropdown;
