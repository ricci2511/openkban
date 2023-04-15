import React, { useState } from 'react';
import { useCurrentTask } from 'store/kanban-store';
import { RxPencil1, RxPlus, RxTextAlignLeft } from 'react-icons/rx';
import { DescriptionForm } from './description-form';

export const Description = () => {
    const { title, description } = useCurrentTask()!;
    const [editting, setEditting] = useState(false);
    const startEditting = () => setEditting(true);
    const stopEditting = () => setEditting(false);

    return (
        <>
            <div className="mb-2 flex items-center gap-3">
                <RxTextAlignLeft size={22} />
                <h4 className="text-xl font-semibold">Task Description</h4>
                {!editting && description && (
                    <button
                        className="btn-outline btn-ghost btn-sm btn"
                        onClick={startEditting}
                    >
                        <RxPencil1 size={18} />
                    </button>
                )}
            </div>
            <div className="ml-9">
                {!description && !editting && (
                    <button
                        className="btn-sm btn mt-2 flex gap-2"
                        onClick={startEditting}
                    >
                        Add description
                        <RxPlus size={18} />
                    </button>
                )}
                {editting ? (
                    <DescriptionForm stopEdittingCb={stopEditting} />
                ) : (
                    <p
                        className="text-base"
                        aria-label={`Description of ${title}`}
                    >
                        {description}
                    </p>
                )}
            </div>
        </>
    );
};
