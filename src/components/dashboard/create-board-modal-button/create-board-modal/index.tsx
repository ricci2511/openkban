import { zodResolver } from '@hookform/resolvers/zod';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CreateBoardForm from './create-board-form';
import Dialog, { DialogType } from '@components/ui/dialog';
import { Button, Modal } from 'react-daisyui';
import useCreateBoard from '@hooks/use-create-board';
import { BoardColumnsLayout } from 'types/board-types';

const CreateBoardModal = ({ open, closeDialog }: DialogType) => {
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
        closeDialog();
        formMethods.reset();
        setLayout('default');
    };
    const { createBoard, isLoading } = useCreateBoard(onCreateBoardSuccess);

    return (
        <Dialog open={open} closeDialog={closeDialog} className="max-w-3xl">
            <Modal.Header className="mt-2 text-2xl font-bold">
                Create a new board
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...formMethods}>
                    <CreateBoardForm
                        createBoard={createBoard}
                        layout={layout}
                        setLayout={setLayout}
                    />
                </FormProvider>
            </Modal.Body>
            <Modal.Actions>
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
                    onClick={closeDialog}
                    aria-label="Cancel board creation and close dialog"
                >
                    Cancel
                </Button>
            </Modal.Actions>
        </Dialog>
    );
};

export default CreateBoardModal;
