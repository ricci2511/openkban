import ClientOnlyPortal from '@components/client-only-portal';
import { VariantProps, cva, cx } from 'class-variance-authority';
import React, { PropsWithChildren } from 'react';

export type ModalType = {
    isOpen: boolean;
    toggleModal: () => void;
};

const modalBase = cva('', {
    variants: {
        maxWidth: {
            sm: ['max-w-sm'],
            md: ['max-w-md'],
            lg: ['max-w-lg'],
            xl: ['max-w-xl'],
            twoXl: ['max-w-2xl'],
            threeXl: ['max-w-3xl'],
            full: ['max-w-full'],
        },
    },
});

type ModalBaseProps = VariantProps<typeof modalBase>;
interface ModalProps extends ModalBaseProps, ModalType, PropsWithChildren {
    title?: string;
}

const Modal = ({
    children,
    isOpen,
    toggleModal,
    title,
    maxWidth,
}: ModalProps) => {
    return (
        <ClientOnlyPortal selector="#modal">
            <div className={cx('modal', isOpen ? 'modal-open' : null)}>
                <div
                    className={cx(
                        'modal-box relative',
                        modalBase({ maxWidth })
                    )}
                >
                    <button
                        type="button"
                        className="btn-sm btn-circle btn absolute right-2 top-2"
                        aria-label="close modal"
                        onClick={toggleModal}
                    >
                        ✕
                    </button>
                    {title && (
                        <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                            {title}
                        </h2>
                    )}
                    {children}
                </div>
            </div>
        </ClientOnlyPortal>
    );
};

export default Modal;
