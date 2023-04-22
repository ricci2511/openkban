import React, { useState } from 'react';
import { useCreateTask } from '@hooks/mutations/use-task-mutations';
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
import { CreateTaskForm } from './create-task-form';
import { Button } from '@components/ui/button';
import { ClipboardList } from 'lucide-react';

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
                        <DialogTrigger asChild>
                            <Button variant="accent" className="rounded-full">
                                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
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
                        variant="success"
                        loading={isLoading}
                        aria-label="Create a new task"
                    >
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
