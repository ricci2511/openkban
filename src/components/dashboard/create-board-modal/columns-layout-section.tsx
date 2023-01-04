import React from 'react';
import LayoutSelectionCard from './layout-selection-card';
import { BoardColumnsLayout } from 'types/board-types';
import CustomLayoutSection from './custom-layout-section';
import { UseFormSetValue } from 'react-hook-form';
import { BoardCreation } from '@lib/schemas/board-schemas';
import { defaultBoardColumnsLayout } from '@lib/constants';

interface ColumnsLayoutSectionProps {
    layout: BoardColumnsLayout;
    setLayout: (layout: BoardColumnsLayout) => void;
    setFormValue: UseFormSetValue<BoardCreation>;
}
const ColumnsLayoutSection = ({
    layout,
    setLayout,
    setFormValue,
}: ColumnsLayoutSectionProps) => {
    const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const layoutValue = e.target.value as BoardColumnsLayout;
        if (e.target.checked) {
            setLayout(layoutValue);
            const isDefault = layoutValue === 'default';
            setFormValue('columns', isDefault ? defaultBoardColumnsLayout : []);
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
            {layout === 'custom' && (
                <CustomLayoutSection setFormValue={setFormValue} />
            )}
        </div>
    );
};

export default ColumnsLayoutSection;
