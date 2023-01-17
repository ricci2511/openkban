import Modal, { ModalType } from '@components/ui/modal';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    BoardTaskCreation,
    boardTaskCreationSchema,
} from '@lib/schemas/board-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import CreateTaskForm from './create-task-form';

const CreateTaskModal = ({ isOpen, toggleModal }: ModalType) => {
    const formMethods = useForm<BoardTaskCreation>({
        resolver: zodResolver(boardTaskCreationSchema),
    });

    return (
        <Modal
            title="Create a new task"
            isOpen={isOpen}
            toggleModal={toggleModal}
            maxWidth="xl"
        >
            <FormProvider {...formMethods}>
                <CreateTaskForm toggleModal={toggleModal} />
            </FormProvider>
        </Modal>
    );
};

export default CreateTaskModal;
