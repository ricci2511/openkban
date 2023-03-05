import EditTitleModal from '@components/ui/form/edit-title-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleInput, titleSchema, taskTitle } from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { BoardTask } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import useKanbanStore from 'store/kanban-store';

interface TaskEditTitleModalProps {
    task: BoardTask;
    isEditting: boolean;
    toggleEditting: () => void;
}
const TaskEditTitleModal = ({
    task,
    isEditting,
    toggleEditting,
}: TaskEditTitleModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(taskTitle)),
    });

    const updateStoreTask = useKanbanStore((state) => state.updateTask);
    const { mutate: updateTask, isLoading } =
        trpc.boardTaskRouter.update.useMutation({
            onSuccess: ({ title }) => {
                updateStoreTask({ ...task, title });
                toggleEditting();
            },
        });

    const onSubmit = handleSubmit(({ title }) => {
        if (title === task.title) {
            toggleEditting();
            return;
        }
        updateTask({ id: task.id, title });
    });

    return (
        <EditTitleModal
            open={isEditting}
            closeDialog={toggleEditting}
            name="task"
            formRegister={register}
            errors={errors}
            onSubmit={onSubmit}
            isLoading={isLoading}
            oldTitle={task.title}
        />
    );
};

export default TaskEditTitleModal;
