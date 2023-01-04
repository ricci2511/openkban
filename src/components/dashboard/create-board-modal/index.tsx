import Modal, { ModalType } from '@components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateBoard from '@hooks/use-create-board';
import { boardCeationSchema, BoardCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ColumnsLayoutSection from './columns-layout-section';
import { BoardColumnsLayout } from 'types/board-types';
import { defaultBoardColumnsLayout } from '@lib/constants';

const CreateBoardModal = ({ isOpen, toggleModal }: ModalType) => {
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BoardCreation>({
        resolver: zodResolver(boardCeationSchema),
        defaultValues: {
            columns: defaultBoardColumnsLayout,
        },
    });

    // columns layout state
    const [layout, setLayout] = useState<BoardColumnsLayout>('default');

    // close modal, reset form and column state after successful board creation
    const onModalSubmitSuccess = () => {
        toggleModal();
        reset();
        setLayout('default');
    };
    const { createBoard, isLoading, error } =
        useCreateBoard(onModalSubmitSuccess);

    const onSubmit = handleSubmit(({ title, isFavourite, columns }) => {
        createBoard({
            title,
            isFavourite,
            columns,
        });
    });

    return (
        <Modal
            title="Create your board"
            isOpen={isOpen}
            toggleModal={toggleModal}
            maxWidth="twoXl"
        >
            <form className="form-control mt-2 w-full" onSubmit={onSubmit}>
                <label className="label">
                    <span className="label-text" aria-required>
                        Board title
                    </span>
                </label>
                <input
                    type="text"
                    required
                    placeholder="Type here"
                    className={cx(
                        'input-bordered input w-full',
                        errors.title && 'input-error'
                    )}
                    {...register('title')}
                />
                {errors.title && (
                    <p className="mt-2 text-sm text-error">
                        {errors.title.message}
                    </p>
                )}
                <label className="label cursor-pointer">
                    <span className="label-text">
                        Add it to your favourites?
                    </span>
                    <input
                        type="checkbox"
                        className="checkbox-primary checkbox"
                        {...register('isFavourite')}
                    />
                </label>
                <ColumnsLayoutSection
                    layout={layout}
                    setLayout={setLayout}
                    setFormValue={setValue}
                />
                <div className="modal-action">
                    <button
                        type="submit"
                        className={cx(
                            'btn-primary btn',
                            isLoading ? 'btn-disabled loading' : null
                        )}
                    >
                        {isLoading ? 'Creating...' : 'Create Board'}
                    </button>
                    <button
                        type="button"
                        className="btn-error btn"
                        onClick={toggleModal}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateBoardModal;
