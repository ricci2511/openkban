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

// Will be refactored to use an alert dialog component once it's implemented
export const DeleteColumnAlertDialog = ({
    columnId,
    title,
    closeAlert,
}: DeleteColumnAlertDialogProps) => {
    const { mutate: deleteColumn, isLoading } = useDeleteColumn();

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>{`Delete column '${title}'`}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                Are you sure you want do delete this column and all the tasks
                within it?
            </AlertDialogDescription>
            <AlertDialogFooter>
                <Button
                    type="button"
                    variant="destructive"
                    loading={isLoading}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteColumn({ id: columnId })}
                >
                    {isLoading ? 'Deleting...' : 'Delete Column'}
                </Button>
                <Button type="button" onClick={closeAlert}>
                    Cancel
                </Button>
            </AlertDialogFooter>
        </>
    );
};
