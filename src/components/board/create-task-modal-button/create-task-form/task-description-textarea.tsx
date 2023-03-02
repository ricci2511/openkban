import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { Textarea } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';

const TaskDescriptionTextarea = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const descriptionError = errors.description;

    return (
        <span>
            <label htmlFor="taskDescription" className="label">
                <span className="label-text">Task description</span>
            </label>
            <Textarea
                id="taskDescription"
                placeholder="This is a task description"
                color={descriptionError ? 'error' : undefined}
                bordered
                borderOffset
                className="w-full"
                {...register('description')}
            />
            {descriptionError && (
                <p className="mt-2 text-sm text-error">
                    {descriptionError.message}
                </p>
            )}
        </span>
    );
};

export default TaskDescriptionTextarea;
