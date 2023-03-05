import { Button, Modal } from 'react-daisyui';
import Dialog, { DialogType } from '@components/ui/dialog';
import { trpc } from '@lib/trpc';
import React from 'react';
import useKanbanStore from 'store/kanban-store';

interface DeleteWarningModalProps extends DialogType {
    columnId: string;
    title: string;
}
const DeleteWarningModal = ({
    open,
    closeDialog,
    columnId,
    title,
}: DeleteWarningModalProps) => {
    const deleteStoreCol = useKanbanStore((state) => state.deleteColumn);
    const {
        mutate: deleteColumn,
        isLoading,
        error: deleteErr,
    } = trpc.boardColumnRouter.delete.useMutation({
        onSuccess: () => {
            closeDialog();
            deleteStoreCol(columnId);
        },
    });

    return (
        <Dialog open={open} closeDialog={closeDialog}>
            <Modal.Header className="mt-2 text-2xl font-bold">
                {`Delete column '${title}'`}
            </Modal.Header>
            <Modal.Body>
                Are you sure you want do delete this column and all the tasks
                within it?
            </Modal.Body>
            <Modal.Actions>
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
                <Button
                    type="button"
                    onClick={closeDialog}
                    aria-label="Cancel column deletion and close modal"
                >
                    Cancel
                </Button>
            </Modal.Actions>
        </Dialog>
    );
};

export default DeleteWarningModal;
