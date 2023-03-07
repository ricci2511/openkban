import FormTextarea from '@components/ui/form/form-textarea';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { Form } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';

const TaskDescriptionTextarea = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

    return (
        <span>
            <Form.Label title="Task description" htmlFor="task-description" />
            <FormTextarea<BoardTaskCreation>
                id="task-description"
                placeholder="description..."
                className="w-full"
                register={register}
                registerName="description"
                errors={errors}
            />
        </span>
    );
};

export default TaskDescriptionTextarea;
