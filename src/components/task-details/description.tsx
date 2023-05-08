import React, { useState } from 'react';
import { useCurrentTask } from 'store/kanban-store';
import { DescriptionForm } from './description-form';
import { AlignLeft, Pencil, Plus } from 'lucide-react';
import { Button } from '@components/ui/button';

export const Description = ({ canUpdateTask }: { canUpdateTask: boolean }) => {
    const { title, description } = useCurrentTask()!;
    const [editting, setEditting] = useState(false);
    const startEditting = () => setEditting(true);

    return (
        <>
            <div className="mb-2 flex items-center gap-3">
                <AlignLeft className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Description</h4>
                {!editting && description && canUpdateTask && (
                    <Button variant="outline" size="xs" onClick={startEditting}>
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            <div className="ml-9">
                {!description && !editting && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            No description has been provided for this task.
                        </span>
                        {canUpdateTask && (
                            <Button
                                size="xs"
                                className="flex gap-2 text-sm"
                                onClick={startEditting}
                            >
                                Add
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
                {editting ? (
                    <DescriptionForm
                        stopEdittingCb={() => setEditting(false)}
                    />
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
