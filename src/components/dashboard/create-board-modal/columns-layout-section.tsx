import React from 'react';
import LayoutSelectionCard from './layout-selection-card';
import { BoardColumnsLayout } from 'types/board-types';

interface ColumnsLayoutSectionProps {
    layout: BoardColumnsLayout;
    setLayout: (layout: BoardColumnsLayout) => void;
}
const ColumnsLayoutSection = ({
    layout,
    setLayout,
}: ColumnsLayoutSectionProps) => {
    const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setLayout(e.target.value as BoardColumnsLayout);
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
        </div>
    );
};

export default ColumnsLayoutSection;
