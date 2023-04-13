import { BoardCreation } from '@lib/schemas/board-schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { randomId } from '@lib/helpers';
import { MAX_COLUMNS } from '@lib/constants';
import { FormErrors } from 'types/form-types';
import { Button } from 'react-daisyui';
import { InfoTooltip } from '@components/ui/info-tooltip';
import { SortableColumnItemsContainer } from './sortable-column-items-container';
import { FormInput } from '@components/ui/form-input';

export type CustomColumn = {
    id: string;
    title: string;
};

export const CustomLayoutSection = () => {
    const {
        register,
        getValues,
        setValue,
        setFocus,
        resetField,
        trigger,
        clearErrors,
        formState: { errors },
    } = useFormContext<BoardCreation>();

    const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
    const columnTitles = useMemo(
        () => customColumns.map((col) => col.title),
        [customColumns]
    );

    const isMaxColumns = customColumns.length === MAX_COLUMNS;
    const titleInput: `columnTitles.${number}` = `columnTitles.${customColumns.length}`;

    useEffect(() => {
        setValue('columnTitles', columnTitles);
        // reset title input value after adding a column
        resetField(titleInput, { defaultValue: '' });
    }, [setValue, columnTitles, resetField, titleInput]);

    const handleColumnAddition = async () => {
        clearErrors('columnTitles');
        // column title validation
        const isValid = await trigger(titleInput, { shouldFocus: true });
        if (!isValid || isMaxColumns) return;
        setCustomColumns((prevCols) => [
            ...prevCols,
            {
                id: randomId(),
                title: getValues(titleInput),
            },
        ]);
        setFocus(titleInput);
    };

    const handleColumnDeletion = (id: string) => {
        setCustomColumns((prevCols) => prevCols.filter((col) => col.id !== id));
    };

    return (
        <div className="form-control mt-6">
            <span className="w-full">
                <label
                    className="label cursor-pointer justify-start gap-2"
                    htmlFor="column-title"
                >
                    <span className="label-text">Column title</span>
                    <InfoTooltip
                        message={`${MAX_COLUMNS} columns can be added, sorted left to right`}
                        position="right"
                    />
                </label>
                <FormInput<BoardCreation>
                    id="column-title"
                    placeholder="title..."
                    title={
                        isMaxColumns
                            ? `Cannot add more than ${MAX_COLUMNS} columns`
                            : 'Set your column title'
                    }
                    register={register}
                    registerName={titleInput}
                    registerRules={{ disabled: isMaxColumns }}
                    errors={errors as FormErrors<BoardCreation>}
                    onKeyDown={(e) =>
                        e.key === 'Enter' ? handleColumnAddition() : null
                    }
                    autoFocus
                >
                    <Button
                        disabled={isMaxColumns}
                        type="button"
                        onClick={handleColumnAddition}
                    >
                        Add
                    </Button>
                </FormInput>
            </span>
            <ul className="m-4 grid w-full grid-flow-row grid-cols-2 gap-y-2 gap-x-4 self-center sm:grid-cols-3">
                <SortableColumnItemsContainer
                    columns={customColumns}
                    setColumns={setCustomColumns}
                    handleColumnDeletion={handleColumnDeletion}
                />
            </ul>
        </div>
    );
};
