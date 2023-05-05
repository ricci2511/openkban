import React, { useState } from 'react';
import { useCurrentTask, useSubtasks } from 'store/kanban-store';
import { SubtaskItem } from './subtask-item';
import { CreateSubtaskForm } from './create-subtask-form';
import { ListChecks, Plus } from 'lucide-react';
import { Button } from '@components/ui/button';

export const Subtasks = () => {
    const { title } = useCurrentTask()!;
    const subtasks = useSubtasks();

    const [adding, setAdding] = useState(false);
    const stopAdding = () => setAdding(false);
    const startAdding = () => setAdding(true);

    return (
        <>
            <span className="flex items-center gap-3">
                <ListChecks className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Subtasks</h4>
            </span>
            <ul className="my-3" aria-label={`Subtasks list of ${title}`}>
                {subtasks.map((subtask) => (
                    <SubtaskItem key={subtask.id} data={subtask} />
                ))}
            </ul>
            {adding ? (
                <CreateSubtaskForm stopAddingCb={stopAdding} />
            ) : (
                <Button
                    variant="primary"
                    size="sm"
                    className="ml-9 flex gap-2"
                    onClick={startAdding}
                    aria-label="Add a subtask"
                >
                    <span>Add a subtask</span>
                    <Plus className="h-4 w-4" />
                </Button>
            )}
        </>
    );
};
