import { Button } from 'react-daisyui';
import React from 'react';
import { useDeleteColumn } from '@hooks/mutations/use-column-mutations';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog';

interface DeleteColumnAlertDialogProps {
    columnId: string;
    title: string;
}

// Will be refactored to use an alert dialog component once it's implemented
export const DeleteColumnAlertDialog = ({
    columnId,
    title,
}: DeleteColumnAlertDialogProps) => {
    const { mutate: deleteColumn, isLoading } = useDeleteColumn();

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`Delete column '${title}'`}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Are you sure you want do delete this column and all the tasks
                within it?
            </DialogDescription>
            <DialogFooter>
                <Button
                    type="button"
                    color="error"
                    disabled={isLoading}
                    loading={isLoading}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteColumn({ id: columnId })}
                >
                    {isLoading ? 'Deleting...' : 'Delete Column'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
