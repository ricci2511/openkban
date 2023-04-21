import React, { useState } from 'react';
import { useCurrentTask } from 'store/kanban-store';
import { DescriptionForm } from './description-form';
import { AlignLeft, Pencil, Plus } from 'lucide-react';
import { Button } from '@components/ui/button';

export const Description = () => {
    const { title, description } = useCurrentTask()!;
    const [editting, setEditting] = useState(false);
    const startEditting = () => setEditting(true);
    const stopEditting = () => setEditting(false);

    return (
        <>
            <div className="mb-2 flex items-center gap-3">
                <AlignLeft className="h-5 w-5" />
                <h4 className="text-xl font-semibold">Task Description</h4>
                {!editting && description && (
                    <Button variant="outline" size="sm" onClick={startEditting}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="ml-9">
                {!description && !editting && (
                    <Button
                        size="sm"
                        className="mt-2 flex gap-2"
                        onClick={startEditting}
                    >
                        Add description
                        <Plus className="h-4 w-4" />
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
