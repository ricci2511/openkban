import { CalendarDatePickerWithPresets } from '@components/calendar-date-picker';
import { Label } from '@components/ui/label';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { addDays } from 'date-fns';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const TaskDateInputs = () => {
    const { getValues, control } = useFormContext<BoardTaskCreation>();

    return (
        <>
            <div className="flex w-1/2 flex-col gap-1">
                <Label htmlFor="start-date">Start date</Label>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <CalendarDatePickerWithPresets
                            value={field.value ?? new Date()}
                            onDateChange={(date) => field.onChange(date)}
                            fromDate={new Date()}
                        />
                    )}
                />
            </div>
            <div className="flex w-1/2 flex-col gap-1">
                <Label htmlFor="due-date">Due date</Label>
                <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                        <CalendarDatePickerWithPresets
                            value={field.value ?? addDays(new Date(), 5)}
                            onDateChange={(date) => field.onChange(date)}
                            fromDate={
                                getValues('startDate')
                                    ? addDays(getValues('startDate'), 1)
                                    : new Date()
                            }
                        />
                    )}
                />
            </div>
        </>
    );
};
