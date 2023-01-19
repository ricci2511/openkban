import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const TaskDateInputs = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const startDateError = errors.startDate;
    const dueDateError = errors.dueDate;
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="flex w-full gap-3">
            <span className="w-1/2">
                <label htmlFor="startDate" className="label">
                    <span className="label-text" aria-required>
                        Start Date
                    </span>
                </label>
                <input
                    type="date"
                    id="startDate"
                    defaultValue={minDate}
                    min={minDate}
                    className={cx(
                        'input-bordered input w-full',
                        startDateError && 'input-error'
                    )}
                    {...register('startDate', {
                        valueAsDate: true,
                        required: true,
                    })}
                />
                {startDateError && (
                    <p className="mt-2 text-sm text-error">
                        {startDateError.message}
                    </p>
                )}
            </span>
            <span className="w-1/2">
                <label htmlFor="dueDate" className="label">
                    <span className="label-text" aria-required>
                        Due Date
                    </span>
                </label>
                <input
                    type="date"
                    id="dueDate"
                    defaultValue={minDate}
                    min={minDate}
                    className={cx(
                        'input-bordered input w-full',
                        dueDateError && 'input-error'
                    )}
                    {...register('dueDate', {
                        valueAsDate: true,
                        required: true,
                    })}
                />
                {dueDateError && (
                    <p className="mt-2 text-sm text-error">
                        {dueDateError.message}
                    </p>
                )}
            </span>
        </div>
    );
};

export default TaskDateInputs;
