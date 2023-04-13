import { FormInput } from '@components/ui/form-input';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import dayjs from 'dayjs';
import React from 'react';
import { Form } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';

const today = new Date().toISOString().split('T')[0];
const tomorrow = dayjs().add(1, 'day').toISOString().split('T')[0];

// TODO: Improve date input min/max logic
export const TaskDateInputs = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

    return (
        <>
            <div className="w-1/2">
                <Form.Label title="Start date" htmlFor="start-date" />
                <FormInput<BoardTaskCreation>
                    id="start-date"
                    type="date"
                    defaultValue={today}
                    min={today}
                    className="w-full"
                    register={register}
                    registerName="startDate"
                    registerRules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </div>
            <div className="w-1/2">
                <Form.Label title="Due date" htmlFor="due-date" />
                <FormInput<BoardTaskCreation>
                    id="due-date"
                    type="date"
                    defaultValue={tomorrow}
                    min={tomorrow}
                    className="w-full"
                    register={register}
                    registerName="dueDate"
                    registerRules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </div>
        </>
    );
};
