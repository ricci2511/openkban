import Modal, { ModalType } from '@components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateBoard from '@hooks/use-create-board';
import {
    boardCeationSchema,
    BoardFormSchemaType,
} from '@lib/schemas/board-creation-schema';
import { cx } from 'class-variance-authority';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ColumnsLayoutSection from './columns-layout-section';

const CreateBoardModal = ({ isOpen, toggleModal }: ModalType) => {
    const { createBoard, isLoading, error } = useCreateBoard(toggleModal);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BoardFormSchemaType>({
        resolver: zodResolver(boardCeationSchema),
    });
    // columns layout state
    const [layout, setLayout] = useState<'default' | 'custom'>('default');
    const getColumnData = () => {
        // TODO: handle custom column layout data
        return [
            {
                title: 'To Do',
                position: 0,
            },
            {
                title: 'In Progress',
                position: 1,
            },
            {
                title: 'Testing',
                position: 2,
            },
            {
                title: 'Done',
                position: 3,
            },
        ];
    };

    const onSubmit = handleSubmit(({ title, isFavourite }) => {
        createBoard({
            title: title,
            isFavourite: isFavourite,
            columns: getColumnData(),
        });
        reset();
    });

    return (
        <Modal
            title="Create your board"
            isOpen={isOpen}
            toggleModal={toggleModal}
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
                <p className="mt-2 text-error">{errors.title?.message}</p>
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
                <ColumnsLayoutSection layout={layout} setLayout={setLayout} />
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
