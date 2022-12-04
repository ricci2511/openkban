import { cx } from 'class-variance-authority';
import React, { PropsWithChildren } from 'react';

export type ModalType = {
    isOpen: boolean;
    toggleModal: () => void;
};

interface ModalProps extends ModalType, PropsWithChildren {
    title?: string;
}

const Modal = ({ children, isOpen, toggleModal, title }: ModalProps) => {
    return (
        <div
            className={cx('modal cursor-pointer', isOpen ? 'modal-open' : null)}
        >
            <div className="modal-box relative">
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
    );
};

export default Modal;
