import React, { useState } from 'react';
import { CreateColumnForm } from './create-column-form';
import { Button } from '@components/ui/button';
import { Plus } from 'lucide-react';

export const CreateColumnButton = () => {
    const [creating, setCreating] = useState(false);

    return (
        <li className="mt-1">
            {!creating && (
                <Button
                    variant="outline"
                    size="lg"
                    className="flex w-full gap-3"
                    onClick={() => setCreating(true)}
                >
                    <span>Add column</span>
                    <Plus className="h-5 w-5" />
                </Button>
            )}
            {creating && (
                <CreateColumnForm stopCreatingCb={() => setCreating(false)} />
            )}
        </li>
    );
};
