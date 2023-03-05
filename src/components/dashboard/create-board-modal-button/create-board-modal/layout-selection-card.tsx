import { BoardColumnsLayout } from 'types/board-types';
import React, { PropsWithChildren } from 'react';

interface LayoutSelectionCardProps extends PropsWithChildren {
    selected: boolean;
    radioButtonValue: BoardColumnsLayout;
    title: string;
    handleLayoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LayoutSelectionCard = ({
    children,
    selected,
    radioButtonValue,
    title,
    handleLayoutChange,
}: LayoutSelectionCardProps) => {
    const cardClasses = `card card-compact w-1/2 cursor-pointer rounded-xl outline ${
        selected && 'outline-success transition-all duration-300 ease-in-out'
    }`;
    const radioClasses = `radio hidden sm:inline-flex ${
        selected && 'radio-success'
    }`;
    const radioTitleClasses = `card-title text-base transition-colors sm:text-xl ${
        selected && 'text-success'
    }`;

    return (
        <label htmlFor={`radio-${radioButtonValue}`} className={cardClasses}>
            <div className="card-body">
                <div className="card-actions justify-end">
                    <input
                        type="radio"
                        id={`radio-${radioButtonValue}`}
                        value={radioButtonValue}
                        className={radioClasses}
                        checked={selected}
                        onChange={handleLayoutChange}
                    />
                </div>
                <h2 className={radioTitleClasses}>{title}</h2>
                <p className="text-sm md:text-base">{children}</p>
            </div>
        </label>
    );
};

export default LayoutSelectionCard;
