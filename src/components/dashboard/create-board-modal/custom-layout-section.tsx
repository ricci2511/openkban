import { BoardCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { randomId } from '@lib/helpers';
import ColumnItemsContainer from './column-items-container';

export type CustomColumn = {
    id: string;
    title: string;
};

const CustomLayoutSection = () => {
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

    const isMaxColumns = customColumns.length === 6;
    const titleInput: `columnTitles.${number}` = `columnTitles.${customColumns.length}`;

    useEffect(() => {
        setValue('columnTitles', columnTitles);
        // reset title input value after adding a column and set focus
        resetField(titleInput, { defaultValue: '' });
        setFocus(titleInput);
    }, [setValue, columnTitles, resetField, titleInput, setFocus]);

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
    };

    const handleColumnDeletion = (id: string) => {
        setCustomColumns((prevCols) => prevCols.filter((col) => col.id !== id));
    };

    const columnErrors = errors.columnTitles;

    return (
        <div className="form-control mt-6 items-center">
            <label className="label">
                <span className="label-text">Your Columns</span>
            </label>
            <label className="input-group-sm input-group justify-center">
                <input
                    type="text"
                    placeholder="Column title"
                    className={cx(
                        'input-bordered input input-md w-2/3',
                        columnErrors && 'input-error'
                    )}
                    title={
                        isMaxColumns
                            ? 'Cannot add more than 6 columns'
                            : 'Set your column title'
                    }
                    onKeyDown={(e) =>
                        e.key === 'Enter' ? handleColumnAddition() : null
                    }
                    autoFocus
                    {...register(titleInput, {
                        disabled: isMaxColumns,
                    })}
                />
                <button
                    className={cx('btn', isMaxColumns ? 'btn-disabled' : null)}
                    type="button"
                    onClick={handleColumnAddition}
                >
                    Add
                </button>
            </label>
            {columnErrors && columnErrors.length && (
                <p className="mt-2 text-sm text-error">
                    {columnErrors[columnErrors.length - 1]?.message}
                </p>
            )}
            <ul className="m-4 grid grid-flow-row grid-cols-2 gap-y-2 gap-x-4 sm:grid-cols-3">
                <ColumnItemsContainer
                    columns={customColumns}
                    setColumns={setCustomColumns}
                    handleColumnDeletion={handleColumnDeletion}
                />
            </ul>
        </div>
    );
};

export default CustomLayoutSection;
