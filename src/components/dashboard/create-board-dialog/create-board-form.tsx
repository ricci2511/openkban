import React, { useEffect } from 'react';
import {
    ColumnsLayoutSection,
    ColumnsLayoutSectionProps,
} from './columns-layout-section';
import { DEFAULT_COLUMN_TITLES } from '@lib/constants';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { FormErrors } from 'types/form-types';
import { useFormContext } from 'react-hook-form';
import { CreateBoardMutation } from '@hooks/mutations/use-board-mutations';
import { Label } from '@components/ui/label';
import { FormCheckbox } from '@components/form-checkbox';
import { FormInput } from '@components/form-input';

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
        control,
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
        <form
            role="form"
            id="create-board-form"
            className="mt-2 flex flex-col gap-4"
            onSubmit={onSubmit}
            onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : null)}
        >
            <div className="flex flex-col">
                <Label htmlFor="board-title">Title</Label>
                <FormInput<BoardCreation>
                    id="board-title"
                    type="text"
                    placeholder="my cool board..."
                    className="mt-1"
                    register={register}
                    name="title"
                    rules={{ required: true }}
                    errors={errors as FormErrors<BoardCreation>}
                />
            </div>
            <div className="flex flex-col">
                <Label>Columns layout</Label>
                <ColumnsLayoutSection layout={layout} setLayout={setLayout} />
                {errors.columnTitles && (
                    <p className="text-error mx-auto mt-2 text-sm">
                        {errors.columnTitles.message}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <FormCheckbox<BoardCreation>
                    id="favourite"
                    name="isFavourite"
                    control={control}
                >
                    Add it to your Favourites?
                </FormCheckbox>
            </div>
        </form>
    );
};
