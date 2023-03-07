import FormInput from '@components/ui/form/form-input';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { Form } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';

const TaskTitleInput = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

    return (
        <span>
            <Form.Label title="Task title" htmlFor="task-title" />
            <FormInput<BoardTaskCreation>
                id="task-title"
                type="text"
                placeholder="title..."
                className="w-full"
                register={register}
                registerName="title"
                registerRules={{ required: true }}
                errors={errors}
            />
        </span>
    );
};

export default TaskTitleInput;
