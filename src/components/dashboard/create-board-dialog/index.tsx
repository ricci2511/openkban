import { zodResolver } from '@hookform/resolvers/zod';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'react-daisyui';
import { BoardColumnsLayout } from 'types/board-types';
import { useCreateBoard } from '@hooks/mutations/use-board-mutations';
import { CreateBoardForm } from './create-board-form';
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@components/ui/dialog';

export const CreateBoardDialog = () => {
    const formMethods = useForm<BoardCreation>({
        resolver: zodResolver(boardCeationSchema),
    });
    const { getValues, setValue } = formMethods;

    // columns layout state
    const [layout, setLayout] = useState<BoardColumnsLayout>('default');
    const [open, setOpen] = useState(false);

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
        setOpen(false);
        setLayout('default');
        formMethods.reset();
    };
    const { mutate: createBoard, isLoading } =
        useCreateBoard(onCreateBoardSuccess);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger className="btn-primary btn">Add Board</DialogTrigger>
            <DialogContent className="sm:max-w-xl">
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
                        onClick={() => setOpen(false)}
                        aria-label="Cancel board creation and close dialog"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
