import { BoardCreation } from '@lib/schemas/board-schemas';
import React, { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface CustomLayoutSectionProps {
    setFormValue: UseFormSetValue<BoardCreation>;
}

const CustomLayoutSection = ({ setFormValue }: CustomLayoutSectionProps) => {
    const [columnTitle, setColumnTitle] = useState('');
    const [customColumns, setCustomColumns] = useState<
        BoardCreation['columns']
    >([]);

    useEffect(() => {
        if (!!customColumns.length) {
            setFormValue('columns', customColumns);
        }
    }, [setFormValue, customColumns]);

    const handleColumnAddition = () => {
        if (columnTitle) {
            setColumnTitle('');
            if (customColumns.length === 6) return; // max 6 columns
            setCustomColumns((prevCols) => [
                ...prevCols,
                {
                    title: columnTitle,
                    position: prevCols.length,
                },
            ]);
        }
    };

    return (
        <div className="form-control mt-6">
            <label className="input-group-sm input-group justify-center">
                <input
                    type="text"
                    placeholder="Column title"
                    className="input-bordered input input-md w-2/3"
                    onChange={(e) => setColumnTitle(e.target.value)}
                    value={columnTitle}
                />
                <button
                    className="btn"
                    type="button"
                    onClick={handleColumnAddition}
                >
                    Add
                </button>
            </label>
            {!!customColumns.length && (
                <ul className="mt-3 flex flex-wrap justify-center gap-2">
                    {customColumns.map((col) => (
                        <li key={col.position} className="badge">
                            {col.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomLayoutSection;
