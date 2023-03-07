import FormInput from '@components/ui/form/form-input';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { Form } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';

const TaskDateInputs = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="flex w-full gap-3">
            <span className="w-1/2">
                <Form.Label title="Start date" htmlFor="start-date" />
                <FormInput<BoardTaskCreation>
                    id="start-date"
                    type="date"
                    defaultValue={minDate}
                    min={minDate}
                    className="w-full"
                    register={register}
                    registerName="startDate"
                    registerRules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </span>
            <span className="w-1/2">
                <Form.Label title="Due date" htmlFor="due-date" />
                <FormInput<BoardTaskCreation>
                    id="due-date"
                    type="date"
                    defaultValue={minDate}
                    min={minDate}
                    className="w-full"
                    register={register}
                    registerName="dueDate"
                    registerRules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </span>
        </div>
    );
};

export default TaskDateInputs;
