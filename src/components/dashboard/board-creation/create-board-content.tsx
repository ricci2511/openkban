import { zodResolver } from '@hookform/resolvers/zod';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BoardColumnsLayout } from 'types/board-types';
import { useCreateBoard } from '@hooks/mutations/use-board-mutations';
import { DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { CreateBoardForm } from './create-board-form';
import { Button } from '@components/ui/button';

export const CreateBoardContent = ({ close }: { close: () => void }) => {
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

    // close dialog, reset form and column layout state after successful board creation
    const onCreateBoardSuccess = () => {
        close();
        setLayout('default');
        formMethods.reset();
    };
    const { mutate: createBoard, isLoading } =
        useCreateBoard(onCreateBoardSuccess);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create a new board</DialogTitle>
            </DialogHeader>
            <FormProvider {...formMethods}>
                <CreateBoardForm
                    createBoard={createBoard}
                    layout={layout}
                    setLayout={setLayout}
                />
            </FormProvider>
            <DialogFooter>
                <Button
                    type="submit"
                    form="create-board-form"
                    variant="success"
                    loading={isLoading}
                    onClick={handleSubmitClick}
                    aria-label="Create a new board"
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
                <Button
                    type="button"
                    disabled={isLoading}
                    onClick={close}
                    aria-label="Cancel board creation and close dialog"
                >
                    Cancel
                </Button>
            </DialogFooter>
        </>
    );
};
