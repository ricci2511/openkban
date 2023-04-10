import { ClientOnlyPortal } from '@components/client-only-portal';
import React, { PropsWithChildren } from 'react';
import { Button, Modal as DaisyModal } from 'react-daisyui';

export type ModalType = {
    open: boolean;
    closeModal: () => void | React.Dispatch<React.SetStateAction<boolean>>;
};
interface ModalProps extends ModalType, PropsWithChildren {
    className?: string;
}
export const Modal = ({
    open,
    closeModal,
    className,
    children,
}: ModalProps) => {
    return (
        <ClientOnlyPortal>
            <DaisyModal
                open={open}
                onClickBackdrop={closeModal}
                className={className}
            >
                <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    onClick={closeModal}
                >
                    ✕
                </Button>
                {children}
            </DaisyModal>
        </ClientOnlyPortal>
    );
};

export const ModalHeader = DaisyModal.Header;
export const ModalBody = DaisyModal.Body;
export const ModalActions = DaisyModal.Actions;
