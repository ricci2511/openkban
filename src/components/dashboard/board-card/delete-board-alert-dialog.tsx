import React from 'react';
import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { useDeleteBoard } from '@hooks/mutations/use-board-mutations';

interface DeleteBoardAlertDialogProps {
    boardId: string;
    title: string;
    closeAlert: () => void;
}

export const DeleteBoardAlertDialog = ({
    boardId,
    title,
    closeAlert,
}: DeleteBoardAlertDialogProps) => {
    const { mutate: deleteBoard, isLoading } = useDeleteBoard();

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                This will delete the Board <strong>{title}</strong> and all of
                its contents, including all tasks.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <Button
                    type="button"
                    variant="destructive"
                    loading={isLoading}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteBoard({ id: boardId })}
                >
                    {isLoading ? 'Deleting...' : 'Yes, delete board'}
                </Button>
                <Button type="button" onClick={closeAlert}>
                    Cancel
                </Button>
            </AlertDialogFooter>
        </>
    );
};
