import React from 'react';
import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { useDeleteTask } from '@hooks/mutations/use-task-mutations';

interface DeleteTaskAlertDialogProps {
    taskId: string;
    title: string;
    closeAlert: () => void;
}

// Will be refactored to use an alert dialog component once it's implemented
export const DeleteTaskAlertDialog = ({
    taskId,
    title,
    closeAlert,
}: DeleteTaskAlertDialogProps) => {
    const { mutate: deleteTask, isLoading } = useDeleteTask();

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                This will delete the task <strong>{title}</strong> and all of
                its contents.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <Button
                    type="button"
                    variant="destructive"
                    loading={isLoading}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteTask({ id: taskId })}
                >
                    {isLoading ? 'Deleting...' : 'Yes, delete task'}
                </Button>
                <Button type="button" onClick={closeAlert}>
                    Cancel
                </Button>
            </AlertDialogFooter>
        </>
    );
};
