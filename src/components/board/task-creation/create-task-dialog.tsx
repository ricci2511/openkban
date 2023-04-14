import { Button } from 'react-daisyui';
import React, { useState } from 'react';
import { useCreateTask } from '@hooks/mutations/use-task-mutations';
import { CreateTaskForm } from './create-task-form';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '@components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { RxCardStackPlus } from 'react-icons/rx';

export const CreateTaskDialog = () => {
    const [open, setOpen] = useState(false);
    // close the dialog after successful task creation
    const { mutate: createTask, isLoading } = useCreateTask(() =>
        setOpen(false)
    );

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger className="btn-outline btn-circle btn max-h-2">
                            <RxCardStackPlus size={16} />
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent variant="info" side="bottom">
                        Add a new task
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm createTask={createTask} />
                <DialogFooter>
                    <Button
                        type="submit"
                        form="create-task-form"
                        color="primary"
                        loading={isLoading}
                        disabled={isLoading}
                        aria-label="Create a new task"
                    >
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
