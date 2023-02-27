import Modal, { ModalType } from '@components/ui/modal';
import { trpc } from '@lib/trpc';
import { cx } from 'class-variance-authority';
import React from 'react';
import useKanbanStore from 'store/kanban-store';

interface DeleteWarningModalProps extends ModalType {
    columnId: string;
    title: string;
}
const DeleteWarningModal = ({
    isOpen,
    toggleModal,
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
            toggleModal();
            deleteStoreCol(columnId);
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            toggleModal={toggleModal}
            title={`Delete column '${title}'`}
        >
            <p className="py-4">
                Are you sure you want do delete this column and all the tasks
                within it?
            </p>
            <div className="modal-action">
                <button
                    type="button"
                    className={cx(
                        'btn-error btn',
                        isLoading ? 'btn-disabled loading' : null
                    )}
                    aria-label={`Delete ${title} column`}
                    onClick={() => deleteColumn({ id: columnId })}
                >
                    {isLoading ? 'Deleting...' : 'Delete Column'}
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={toggleModal}
                    aria-label="Cancel column deletion and close modal"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default DeleteWarningModal;
