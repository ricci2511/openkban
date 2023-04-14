import React, { useEffect } from 'react';
import {
    ColumnsLayoutSection,
    ColumnsLayoutSectionProps,
} from './columns-layout-section';
import { DEFAULT_COLUMN_TITLES } from '@lib/constants';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { Form } from 'react-daisyui';
import { FormErrors } from 'types/form-types';
import { useFormContext } from 'react-hook-form';
import { CreateBoardMutation } from '@hooks/mutations/use-board-mutations';
import { FormInput } from '@components/ui/form-input';

interface CreateBoardFormProps extends ColumnsLayoutSectionProps {
    createBoard: CreateBoardMutation['mutate'];
}

export const CreateBoardForm = ({
    createBoard,
    layout,
    setLayout,
}: CreateBoardFormProps) => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useFormContext<BoardCreation>();

    // initialize column titles state with default layout
    useEffect(() => {
        setValue('columnTitles', DEFAULT_COLUMN_TITLES);
    }, [setValue]);

    // create board after valid form submission
    const onSubmit = handleSubmit(({ title, isFavourite, columnTitles }) => {
        createBoard({
            title,
            isFavourite,
            columnTitles,
        });
    });

    return (
        <Form
            className="mt-2 w-full gap-2"
            onSubmit={onSubmit}
            onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : null)}
            id="create-board-form"
        >
            <span>
                <Form.Label title="Board title" htmlFor="board-title" />
                <FormInput<BoardCreation>
                    id="board-title"
                    type="text"
                    placeholder="title..."
                    register={register}
                    registerName="title"
                    registerRules={{ required: true }}
                    errors={errors as FormErrors<BoardCreation>}
                />
            </span>
            <span>
                <Form.Label title="Columns layout" />
                <ColumnsLayoutSection layout={layout} setLayout={setLayout} />
                {errors.columnTitles && (
                    <p className="mx-auto mt-2 text-sm text-error">
                        {errors.columnTitles.message}
                    </p>
                )}
            </span>
            <Form.Label
                title="Add it to your favourites?"
                className="justify-start gap-3"
            >
                <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    {...register('isFavourite')}
                />
            </Form.Label>
        </Form>
    );
};
