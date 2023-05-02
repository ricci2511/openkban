import React from 'react';
import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { useDeleteTask } from '@hooks/mutations/use-task-mutations';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';

interface DeleteTaskAlertDialogProps {
    taskId: string;
    ownerId: string;
    title: string;
    closeAlert: () => void;
}

export const DeleteTaskAlertDialog = ({
    taskId,
    ownerId,
    title,
    closeAlert,
}: DeleteTaskAlertDialogProps) => {
    const { mutate: deleteTask, isLoading } = useDeleteTask();
    // check if the current user has permissions to delete the task
    const canDelete = useCanPerformEntityAction('TASK', 'DELETE', ownerId);

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
                    disabled={!canDelete}
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
