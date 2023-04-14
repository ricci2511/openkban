import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-daisyui';
import { useColumns } from 'store/kanban-store';
import { InfoTooltip } from '@components/ui/info-tooltip';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectGroup,
} from '@components/ui/select';
import { cn } from '@lib/helpers';

export const ColumnSelect = () => {
    const {
        setValue, // used instead of register because it cant be used with radix-ui Select
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const selectErrors = errors.columnId;
    const columns = useColumns();

    return (
        <>
            <Form.Label
                title="Column"
                htmlFor="column"
                className="justify-start gap-2"
            >
                <InfoTooltip
                    message="Pick the column you want to add the task to"
                    position="right"
                />
            </Form.Label>
            <Select onValueChange={(colId) => setValue('columnId', colId)}>
                <SelectTrigger
                    className={cn(
                        'w-1/2',
                        selectErrors && 'border-error outline-error'
                    )}
                >
                    <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {columns.map(({ id, title }) => (
                            <SelectItem key={id} value={id}>
                                {title}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {selectErrors && (
                <p className="mt-2 text-sm text-error">
                    {selectErrors.message}
                </p>
            )}
        </>
    );
};
