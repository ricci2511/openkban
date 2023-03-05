import ClientOnlyPortal from '@components/client-only-portal';
import React, { PropsWithChildren } from 'react';
import { Button, Modal } from 'react-daisyui';

export type DialogType = {
    open: boolean;
    closeDialog: () => void | React.Dispatch<React.SetStateAction<boolean>>;
};
interface DialogProps extends DialogType, PropsWithChildren {
    className?: string;
}
const Dialog = ({ open, closeDialog, className, children }: DialogProps) => {
    return (
        <ClientOnlyPortal selector="#modal">
            <Modal
                open={open}
                onClickBackdrop={closeDialog}
                className={className}
            >
                <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    onClick={closeDialog}
                >
                    ✕
                </Button>
                {children}
            </Modal>
        </ClientOnlyPortal>
    );
};

export default Dialog;
