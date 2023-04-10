import { Button } from 'react-daisyui';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    BoardTaskCreation,
    boardTaskCreationSchema,
} from '@lib/schemas/board-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTask } from '@hooks/mutations/use-task-mutations';
import {
    ModalType,
    Modal,
    ModalHeader,
    ModalBody,
    ModalActions,
} from '@components/ui/modal';
import { CreateTaskForm } from './create-task-form';

export const CreateTaskModal = ({ open, closeModal }: ModalType) => {
    const formMethods = useForm<BoardTaskCreation>({
        resolver: zodResolver(boardTaskCreationSchema),
    });

    const onCreateTaskSuccess = () => {
        closeModal();
        formMethods.reset();
    };
    const { mutate: createTask, isLoading } =
        useCreateTask(onCreateTaskSuccess);

    return (
        <Modal open={open} closeModal={closeModal} className="max-w-2xl">
            <ModalHeader className="mt-2 text-2xl font-bold">
                Create a new Task
            </ModalHeader>
            <ModalBody>
                <FormProvider {...formMethods}>
                    <CreateTaskForm createTask={createTask} />
                </FormProvider>
            </ModalBody>
            <ModalActions>
                <Button
                    type="submit"
                    form="create-task-form"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label="Create a new task"
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    onClick={closeModal}
                    aria-label="Cancel task creation and close dialog"
                >
                    Cancel
                </Button>
            </ModalActions>
        </Modal>
    );
};
