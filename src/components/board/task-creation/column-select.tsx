import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { useFormContext } from 'react-hook-form';
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
import { Label } from '@components/ui/label';

export const ColumnSelect = () => {
    const {
        setValue,
        clearErrors,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

    const selectErrors = errors.columnId;

    // radix ui select doesn't play well with register, so value is set manually
    // along with clearing any errors
    const onValueChange = (value: string) => {
        setValue('columnId', value);
        if (selectErrors) clearErrors('columnId');
    };

    const columns = useColumns();

    return (
        <>
            <div className="flex items-center space-x-1">
                <Label htmlFor="column">Column</Label>
                <InfoTooltip
                    message="Pick the column you want to add the task to"
                    position="right"
                />
            </div>
            <Select onValueChange={onValueChange}>
                <SelectTrigger
                    id="column"
                    className={cn(
                        'w-1/2',
                        selectErrors &&
                            'border-error outline-error focus:ring-error' // will be encapsulated in SelectContent once I build the design system
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
