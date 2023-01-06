import { BoardCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';

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

    const [customColumns, setCustomColumns] = useState<
        BoardCreation['columns']
    >([]);

    const isMaxColumns = customColumns.length === 6;
    const titleInput: `columns.${number}.title` = `columns.${customColumns.length}.title`;

    useEffect(() => {
        setValue('columns', customColumns);
        // reset title input value after adding a column and set focus
        resetField(titleInput, { defaultValue: '' });
        setFocus(titleInput);
    }, [setValue, customColumns, resetField, titleInput, setFocus]);

    const handleColumnAddition = async () => {
        clearErrors('columns');
        // column title validation
        const isValid = await trigger(titleInput, { shouldFocus: true });
        if (!isValid || isMaxColumns) return;
        setCustomColumns((prevCols) => [
            ...prevCols,
            {
                title: getValues(titleInput),
                position: prevCols.length,
            },
        ]);
    };

    const handleColumnDeletion = (position: number) => {
        setCustomColumns((prevCols) =>
            prevCols
                .filter((col) => col.position !== position)
                .map((col, i) => ({ ...col, position: i }))
        );
    };

    const columnErrors = errors.columns;

    return (
        <div className="form-control mt-6 items-center">
            <label className="label">
                <span className="label-text">Your Columns</span>
            </label>
            <label className="input-group-sm input-group justify-center">
                <input
                    type="text"
                    placeholder="Column title"
                    className="input-bordered input input-md w-2/3"
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
                    {columnErrors[columnErrors.length - 1]?.title?.message}
                </p>
            )}
            {!!customColumns.length && (
                <ul className="mt-3 flex flex-wrap gap-2">
                    {customColumns.map(({ title, position }) => (
                        <li key={position} className="badge items-center gap-2">
                            {title}
                            <RiCloseFill
                                className="cursor-pointer"
                                onClick={() => handleColumnDeletion(position)}
                                aria-label="Delete column"
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomLayoutSection;
