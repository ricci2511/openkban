import { BoardCreation } from '@lib/schemas/board-schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { randomId } from '@lib/helpers';
import { MAX_COLUMNS } from '@lib/constants';
import { FormErrors } from 'types/form-types';
import { InfoTooltip } from '@components/info-tooltip';
import { SortableColumnItemsContainer } from './sortable-column-items-container';
import { Label } from '@components/ui/label';
import { Button } from '@components/ui/button';
import { FormInput } from '@components/form-input';

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
        <div className="mt-4 flex flex-col gap-4">
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-center space-x-1">
                    <Label htmlFor="column-title">Column title</Label>
                    <InfoTooltip
                        message={`${MAX_COLUMNS} columns can be added, sorted left to right`}
                        side="right"
                    />
                </div>
                <FormInput<BoardCreation>
                    id="column-title"
                    className="flex-1"
                    placeholder="title..."
                    title={
                        isMaxColumns
                            ? `Cannot add more than ${MAX_COLUMNS} columns`
                            : 'Set your column title'
                    }
                    register={register}
                    name={titleInput}
                    rules={{ disabled: isMaxColumns }}
                    errors={errors as FormErrors<BoardCreation>}
                    onKeyDown={(e) =>
                        e.key === 'Enter' ? handleColumnAddition() : null
                    }
                    autoFocus
                >
                    <Button
                        type="button"
                        disabled={isMaxColumns}
                        onClick={handleColumnAddition}
                    >
                        Add
                    </Button>
                </FormInput>
            </div>
            {customColumns.length > 0 && (
                <ul className="m-4 grid w-full grid-flow-row grid-cols-2 gap-y-2 gap-x-4 self-center sm:grid-cols-3">
                    <SortableColumnItemsContainer
                        columns={customColumns}
                        setColumns={setCustomColumns}
                        handleColumnDeletion={handleColumnDeletion}
                    />
                </ul>
            )}
        </div>
    );
};
