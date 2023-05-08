import { useState } from 'react';
import { CreateSubtaskForm } from './create-subtask-form';
import { Button } from '@components/ui/button';
import { Plus } from 'lucide-react';

export const AddSubtaskButton = () => {
    const [adding, setAdding] = useState(false);

    return (
        <>
            {adding ? (
                <CreateSubtaskForm stopAddingCb={() => setAdding(false)} />
            ) : (
                <Button
                    variant="primary"
                    size="sm"
                    className="ml-9 flex gap-2"
                    onClick={() => setAdding(true)}
                    aria-label="Add a subtask"
                >
                    <span>Add subtask</span>
                    <Plus className="h-4 w-4" />
                </Button>
            )}
        </>
    );
};
