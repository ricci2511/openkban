import Modal from '@components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateBoard from '@hooks/use-create-board';
import {
    boardCeationSchema,
    BoardFormSchemaType,
} from '@lib/schemas/board-creation-schema';
import { cx } from 'class-variance-authority';
import { atom, useAtom } from 'jotai';
import React from 'react';
import { useForm } from 'react-hook-form';

export const isCreateBoardModalOpen = atom(false);

const CreateBoardModal = () => {
    const { createBoard, error } = useCreateBoard();
    const [isOpen, setIsOpen] = useAtom(isCreateBoardModalOpen);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BoardFormSchemaType>({
        resolver: zodResolver(boardCeationSchema),
    });

    const onSubmit = handleSubmit(({ title, isFavourite }) => {
        createBoard({ title: title, isFavourite: isFavourite });
        setIsOpen(false);
        reset();
    });

    return (
        <Modal title="Create your board" isOpen={isOpen} setIsOpen={setIsOpen}>
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
                <div className="modal-action">
                    <button type="submit" className="btn-primary btn">
                        Create Board
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateBoardModal;
