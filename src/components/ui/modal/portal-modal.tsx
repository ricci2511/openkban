import ClientOnlyPortal from '@components/client-only-portal';
import React, { PropsWithChildren } from 'react';
import { Button, Modal } from 'react-daisyui';

interface PortalModalProps extends PropsWithChildren {
    open: boolean;
    closeModal: () => void;
    className?: string;
}
const PortalModal = ({
    open,
    closeModal,
    className,
    children,
}: PortalModalProps) => {
    return (
        <ClientOnlyPortal selector="#modal">
            <Modal
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
            </Modal>
        </ClientOnlyPortal>
    );
};

export default PortalModal;
