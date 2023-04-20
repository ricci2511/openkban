import { FormInput } from '@components/form-input';
import { Label } from '@components/ui/label';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import dayjs from 'dayjs';
import React from 'react';
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
            <div className="flex w-full flex-col">
                <Label htmlFor="start-date">Start date</Label>
                <FormInput<BoardTaskCreation>
                    id="start-date"
                    type="date"
                    defaultValue={today}
                    min={today}
                    register={register}
                    name="startDate"
                    rules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </div>
            <div className="flex w-full flex-col">
                <Label htmlFor="due-date">Due date</Label>
                <FormInput<BoardTaskCreation>
                    id="due-date"
                    type="date"
                    className="justify-between"
                    defaultValue={tomorrow}
                    min={tomorrow}
                    register={register}
                    name="dueDate"
                    rules={{ valueAsDate: true, required: true }}
                    errors={errors}
                />
            </div>
        </>
    );
};
