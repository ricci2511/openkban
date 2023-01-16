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
        // reset title input value after adding a column
        resetField(titleInput, { defaultValue: '' });
    }, [setValue, columnTitles, resetField, titleInput, getValues]);

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

    const columnErrors = errors.columnTitles;

    return (
        <div className="form-control mt-6">
            <div className="w-full self-center">
                <label className="label">
                    <span className="label-text">Your Columns</span>
                </label>
                <label className="input-group-sm input-group">
                    <input
                        type="text"
                        placeholder="Column title"
                        className={cx(
                            'input-bordered input input-md w-full',
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
                        className={cx(
                            'btn',
                            isMaxColumns ? 'btn-disabled' : null
                        )}
                        type="button"
                        onClick={handleColumnAddition}
                    >
                        Add
                    </button>
                </label>
            </div>

            {columnErrors && columnErrors.length && (
                <p className="mt-2 text-sm text-error">
                    {columnErrors[columnErrors.length - 1]?.message}
                </p>
            )}
            <ul className="m-4 grid w-full grid-flow-row grid-cols-2 gap-y-2 gap-x-4 self-center sm:grid-cols-3">
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
