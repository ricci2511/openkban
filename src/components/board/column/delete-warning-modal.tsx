import { Button } from 'react-daisyui';
import React from 'react';
import { useDeleteColumn } from '@hooks/mutations/use-column-mutations';
import {
    ModalActions,
    Modal,
    ModalType,
    ModalHeader,
    ModalBody,
} from '@components/ui/modal';

interface DeleteWarningModalProps extends ModalType {
    columnId: string;
    title: string;
}

export const DeleteWarningModal = ({
    open,
    closeModal,
    columnId,
    title,
}: DeleteWarningModalProps) => {
    const { mutate: deleteColumn, isLoading } = useDeleteColumn();

    return (
        <Modal open={open} closeModal={closeModal}>
            <ModalHeader className="mt-2 text-2xl font-bold">
                {`Delete column '${title}'`}
            </ModalHeader>
            <ModalBody>
                Are you sure you want do delete this column and all the tasks
                within it?
            </ModalBody>
            <ModalActions>
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
                    onClick={closeModal}
                    aria-label="Cancel column deletion and close modal"
                >
                    Cancel
                </Button>
            </ModalActions>
        </Modal>
    );
};
