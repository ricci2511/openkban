import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import { HiPencil } from 'react-icons/hi';
import { RiAddFill } from 'react-icons/ri';
import DescriptionForm from './description-form';
import { useCurrentTask } from 'store/kanban-store';

const Description = () => {
    const { description } = useCurrentTask()!;
    const [editting, setEditting] = useState(false);
    const startEditting = () => setEditting(true);
    const stopEditting = () => setEditting(false);

    return (
        <div>
            <span className="mb-2 flex items-center gap-3">
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
            </span>
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
                <p className="text-base ">{description}</p>
            )}
        </div>
    );
};

export default Description;
