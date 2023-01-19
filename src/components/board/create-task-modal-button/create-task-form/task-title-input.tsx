import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const TaskTitleInput = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const titleError = errors.title;

    return (
        <span>
            <label htmlFor="taskTitle" className="label">
                <span className="label-text" aria-required>
                    Task title
                </span>
            </label>
            <input
                type="text"
                id="taskTitle"
                placeholder="title"
                className={cx(
                    'input-bordered input w-full',
                    titleError && 'input-error'
                )}
                {...register('title', { required: true })}
            />
            {titleError && (
                <p className="mt-2 text-sm text-error">{titleError.message}</p>
            )}
        </span>
    );
};

export default TaskTitleInput;
