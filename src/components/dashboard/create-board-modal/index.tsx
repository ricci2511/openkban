import Modal, { ModalType } from '@components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CreateBoardForm from './create-board-form';

const CreateBoardModal = ({ isOpen, toggleModal }: ModalType) => {
    const formMethods = useForm<BoardCreation>({
        resolver: zodResolver(boardCeationSchema),
    });

    return (
        <Modal
            title="Create your board"
            isOpen={isOpen}
            toggleModal={toggleModal}
            maxWidth="twoXl"
        >
            <FormProvider {...formMethods}>
                <CreateBoardForm toggleModal={toggleModal} />
            </FormProvider>
        </Modal>
    );
};

export default CreateBoardModal;
