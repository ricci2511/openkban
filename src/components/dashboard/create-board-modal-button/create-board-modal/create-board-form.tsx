import useCreateBoard from '@hooks/use-create-board';
import { cx } from 'class-variance-authority';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ColumnsLayoutSection from './columns-layout-section';
import { BoardColumnsLayout } from 'types/board-types';
import { DEFAULT_COLUMN_TITLES } from '@lib/constants';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { ModalType } from '@components/ui/modal';

const CreateBoardForm = ({ toggleModal }: Pick<ModalType, 'toggleModal'>) => {
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useFormContext<BoardCreation>();

    // initialize column titles state with default layout
    useEffect(() => {
        setValue('columnTitles', DEFAULT_COLUMN_TITLES);
    }, [setValue]);

    // columns layout state
    const [layout, setLayout] = useState<BoardColumnsLayout>('default');

    // sanitize custom columns titles state before submitting by removing invalid titles
    const handleSubmitClick = () => {
        if (layout === 'default') return;
        // remove empty strings and duplicates
        const colTitles = Array.from(
            new Set(getValues('columnTitles').filter((title) => title))
        );
        setValue('columnTitles', colTitles);
    };

    // close modal, reset form and column layout state after successful board creation
    const onCreateBoardSuccess = () => {
        toggleModal();
        reset();
        setLayout('default');
    };
    const { createBoard, isLoading, error } =
        useCreateBoard(onCreateBoardSuccess);

    // create board after valid form submission
    const onSubmit = handleSubmit(({ title, isFavourite, columnTitles }) => {
        createBoard({
            title,
            isFavourite,
            columnTitles,
        });
    });

    return (
        <form
            className="form-control mt-2 w-full"
            onSubmit={onSubmit}
            onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : null)}
        >
            <label className="label">
                <span className="label-text" aria-required>
                    Board title
                </span>
            </label>
            <input
                type="text"
                placeholder="Type here"
                className={cx(
                    'input-bordered input w-full',
                    errors.title && 'input-error'
                )}
                {...register('title', { required: true })}
            />
            {errors.title && (
                <p className="mt-2 text-sm text-error">
                    {errors.title.message}
                </p>
            )}
            <label className="label cursor-pointer">
                <span className="label-text">Add it to your favourites?</span>
                <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    {...register('isFavourite')}
                />
            </label>
            <ColumnsLayoutSection layout={layout} setLayout={setLayout} />
            {errors.columnTitles && (
                <p className="mx-auto mt-2 text-sm text-error">
                    {errors.columnTitles.message}
                </p>
            )}
            <div className="modal-action">
                <button
                    type="submit"
                    className={cx(
                        'btn-primary btn',
                        isLoading ? 'btn-disabled loading' : null
                    )}
                    onClick={handleSubmitClick}
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
    );
};

export default CreateBoardForm;
