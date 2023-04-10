import { zodResolver } from '@hookform/resolvers/zod';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'react-daisyui';
import { BoardColumnsLayout } from 'types/board-types';
import { useCreateBoard } from '@hooks/mutations/use-board-mutations';
import {
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    ModalType,
} from '@components/ui/modal';
import { CreateBoardForm } from './create-board-form';

export const CreateBoardModal = ({ open, closeModal }: ModalType) => {
    const formMethods = useForm<BoardCreation>({
        resolver: zodResolver(boardCeationSchema),
    });
    const { getValues, setValue } = formMethods;

    // columns layout state
    const [layout, setLayout] = useState<BoardColumnsLayout>('default');

    // sanitize custom columns titles state before submitting by removing invalid titles
    const handleSubmitClick = () => {
        if (layout === 'default') return;
        // remove empty strings and duplicates
        const colTitles = Array.from(
            new Set(getValues('columnTitles').filter((title) => title))
        );
        setValue('columnTitles', colTitles);
    };

    // close modal, reset form and column layout state after successful board creation
    const onCreateBoardSuccess = () => {
        closeModal();
        formMethods.reset();
        setLayout('default');
    };
    const { mutate: createBoard, isLoading } =
        useCreateBoard(onCreateBoardSuccess);

    return (
        <Modal open={open} closeModal={closeModal} className="max-w-3xl">
            <ModalHeader className="mt-2 text-2xl font-bold">
                Create a new board
            </ModalHeader>
            <ModalBody>
                <FormProvider {...formMethods}>
                    <CreateBoardForm
                        createBoard={createBoard}
                        layout={layout}
                        setLayout={setLayout}
                    />
                </FormProvider>
            </ModalBody>
            <ModalActions>
                <Button
                    type="submit"
                    form="create-board-form"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmitClick}
                    aria-label="Create a new board"
                >
                    {isLoading ? 'Creating...' : 'Create Board'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    onClick={closeModal}
                    aria-label="Cancel board creation and close dialog"
                >
                    Cancel
                </Button>
            </ModalActions>
        </Modal>
    );
};
