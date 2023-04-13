import React from 'react';
import { BoardColumnsLayout } from 'types/board-types';
import { useFormContext } from 'react-hook-form';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { DEFAULT_COLUMN_TITLES } from '@lib/constants';
import { CustomLayoutSection } from './custom-layout-section';
import { LayoutSelectionCard } from './layout-selection-card';

export interface ColumnsLayoutSectionProps {
    layout: BoardColumnsLayout;
    setLayout: (layout: BoardColumnsLayout) => void;
}
export const ColumnsLayoutSection = ({
    layout,
    setLayout,
}: ColumnsLayoutSectionProps) => {
    const { setValue, clearErrors } = useFormContext<BoardCreation>();

    const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const layoutValue = e.target.value as BoardColumnsLayout;
        if (e.target.checked) {
            setLayout(layoutValue);
            const isDefault = layoutValue === 'default';
            // set the columns state depending on the layout
            setValue('columnTitles', isDefault ? DEFAULT_COLUMN_TITLES : []);
            // clear column validation errors if any
            clearErrors('columnTitles');
        }
    };

    return (
        <div className="mt-2 w-full">
            <div className="flex w-full gap-2">
                <LayoutSelectionCard
                    selected={layout === 'default'}
                    radioButtonValue="default"
                    title="Default"
                    handleLayoutChange={handleLayoutChange}
                >
                    To Do, In Progress, Testing, Done
                </LayoutSelectionCard>
                <div className="divider divider-horizontal">OR</div>
                <LayoutSelectionCard
                    selected={layout === 'custom'}
                    radioButtonValue="custom"
                    title="Custom"
                    handleLayoutChange={handleLayoutChange}
                >
                    Create your own column layout
                </LayoutSelectionCard>
            </div>
            {layout === 'custom' && <CustomLayoutSection />}
        </div>
    );
};
