import { Button, Modal } from 'react-daisyui';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    BoardTaskCreation,
    boardTaskCreationSchema,
} from '@lib/schemas/board-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import CreateTaskForm from './create-task-form';
import Dialog, { DialogType } from '@components/ui/dialog';
import useCreateTask from '@hooks/use-create-task';

const CreateTaskModal = ({ open, closeDialog }: DialogType) => {
    const formMethods = useForm<BoardTaskCreation>({
        resolver: zodResolver(boardTaskCreationSchema),
    });

    const onCreateTaskSuccess = () => {
        closeDialog();
        formMethods.reset();
    };
    const { createTask, isLoading } = useCreateTask(onCreateTaskSuccess);

    return (
        <Dialog open={open} closeDialog={closeDialog} className="max-w-2xl">
            <Modal.Header className="mt-2 text-2xl font-bold">
                Create a new Task
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...formMethods}>
                    <CreateTaskForm createTask={createTask} />
                </FormProvider>
            </Modal.Body>
            <Modal.Actions>
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
                    onClick={closeDialog}
                    aria-label="Cancel task creation and close dialog"
                >
                    Cancel
                </Button>
            </Modal.Actions>
        </Dialog>
    );
};

export default CreateTaskModal;
