import { cx } from 'class-variance-authority';
import { SetStateAction } from 'jotai';
import React, { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
    isOpen: boolean;
    setIsOpen: (
        update: SetStateAction<boolean>
    ) => void | React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
}

const Modal = ({ children, isOpen, setIsOpen, title }: ModalProps) => {
    return (
        <div className={cx('modal', isOpen ? 'modal-open' : null)}>
            <div className="modal-box relative">
                <button
                    type="button"
                    className="btn-sm btn-circle btn absolute right-2 top-2"
                    aria-label="close modal"
                    onClick={() => setIsOpen(false)}
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
