import React from 'react';
import { useDeleteColumn } from '@hooks/mutations/use-column-mutations';
import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';

interface DeleteColumnAlertDialogProps {
    columnId: string;
    title: string;
    closeAlert: () => void;
}

export const DeleteColumnAlertDialog = ({
    columnId,
    title,
    closeAlert,
}: DeleteColumnAlertDialogProps) => {
    const { mutate: deleteColumn, isLoading } = useDeleteColumn();

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                This action will delete the column <strong>{title}</strong> and
                all of its tasks.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <Button
                    type="button"
                    variant="destructive"
                    loading={isLoading}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteColumn({ id: columnId })}
                >
                    {isLoading ? 'Deleting...' : 'Yes, delete column'}
                </Button>
                <Button type="button" onClick={closeAlert}>
                    Cancel
                </Button>
            </AlertDialogFooter>
        </>
    );
};
