import React from 'react';
import { BoardColumnsLayout } from 'types/board-types';
import { useFormContext } from 'react-hook-form';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { DEFAULT_COLUMN_TITLES } from '@lib/constants';
import { CustomLayoutSection } from './custom-layout-section';
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import { Label } from '@components/ui/label';
import { cn } from '@lib/helpers';

export interface ColumnsLayoutSectionProps {
    layout: BoardColumnsLayout;
    setLayout: (layout: BoardColumnsLayout) => void;
}
export const ColumnsLayoutSection = ({
    layout,
    setLayout,
}: ColumnsLayoutSectionProps) => {
    const { setValue, clearErrors } = useFormContext<BoardCreation>();

    const handleLayoutChange = (value: BoardColumnsLayout) => {
        setLayout(value);
        // set the columns state depending on the layout
        setValue(
            'columnTitles',
            value === 'default' ? DEFAULT_COLUMN_TITLES : []
        );
        // clear column validation errors if any
        clearErrors('columnTitles');
    };

    const isDefault = layout === 'default';

    return (
        <div className="mt-2 w-full">
            <RadioGroup
                className="grid-cols-2"
                defaultValue={layout}
                onValueChange={handleLayoutChange}
            >
                <div
                    className={cn(
                        'flex flex-col rounded-lg p-4 outline outline-muted',
                        isDefault && 'outline-success'
                    )}
                >
                    <RadioGroupItem
                        value="default"
                        id="default"
                        className="self-end"
                        variant="success"
                    />
                    <Label htmlFor="default">
                        <span className={`${isDefault && 'text-success'}`}>
                            Default
                        </span>
                        <p className="mt-2 text-sm md:text-base">
                            To do, In progress, Testing, Done
                        </p>
                    </Label>
                </div>
                <div
                    className={cn(
                        'flex flex-col rounded-lg p-4 outline outline-muted',
                        !isDefault && 'outline-success'
                    )}
                >
                    <RadioGroupItem
                        value="custom"
                        id="custom"
                        className="self-end"
                        variant="success"
                    />
                    <Label htmlFor="custom">
                        <span className={`${!isDefault && 'text-success'}`}>
                            Custom
                        </span>
                        <p className="mt-2 text-sm md:text-base">
                            Create your own column layout
                        </p>
                    </Label>
                </div>
            </RadioGroup>
            {!isDefault && <CustomLayoutSection />}
        </div>
    );
};
