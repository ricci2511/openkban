import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { BoardColumn, BoardTask } from '@prisma/client';
import { cx } from 'class-variance-authority';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ColumnSelectProps {
    columns:
        | (BoardColumn & {
              tasks: BoardTask[];
          })[]
        | undefined;
}

const ColumnSelect = ({ columns }: ColumnSelectProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const selectError = errors.columnId;

    return (
        <span>
            <label htmlFor="column" className="label">
                <span className="label-text">
                    Pick the column you want to add the task to
                </span>
            </label>
            <select
                id="column"
                className={cx(
                    'select-bordered select w-full max-w-xs',
                    selectError && 'select-error'
                )}
                defaultValue="default"
                {...register('columnId', { required: true })}
            >
                <option disabled value="default">
                    Which column?
                </option>
                {columns?.map(({ id, title }) => (
                    <option key={id} value={id}>
                        {title}
                    </option>
                ))}
            </select>
            {selectError && (
                <p className="mt-2 text-sm text-error">{selectError.message}</p>
            )}
        </span>
    );
};

export default ColumnSelect;
