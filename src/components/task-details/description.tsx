import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import { HiPencil } from 'react-icons/hi';
import { RiAddFill } from 'react-icons/ri';
import { useCurrentTask } from 'store/kanban-store';
import { RxTextAlignLeft } from 'react-icons/rx';
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
                    <Button
                        color="ghost"
                        variant="outline"
                        size="sm"
                        endIcon={<HiPencil size={18} />}
                        onClick={startEditting}
                    />
                )}
            </div>
            <div className="ml-9">
                {!description && !editting && (
                    <Button
                        className="mt-2"
                        onClick={startEditting}
                        endIcon={<RiAddFill size={18} />}
                    >
                        Add description
                    </Button>
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
