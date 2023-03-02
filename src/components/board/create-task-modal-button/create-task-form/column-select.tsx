import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useKanbanStore from 'store/kanban-store';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Tooltip } from 'react-daisyui';

const ColumnSelect = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const selectError = errors.columnId;
    const columns = useKanbanStore((state) => state.columns);

    return (
        <span>
            <label htmlFor="column" className="label justify-start gap-2">
                <span className="label-text">Column</span>
                <Tooltip
                    message="Pick the column you want to add the task to"
                    position="right"
                    color="info"
                    className="text-xs"
                >
                    <HiOutlineInformationCircle size={18} />
                </Tooltip>
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
                {columns.map(({ id, title }) => (
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
