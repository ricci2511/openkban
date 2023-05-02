import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { Button } from '@components/ui/button';
import { ClipboardList } from 'lucide-react';
import { CreateTaskContent } from './create-task-content';

export const CreateTaskDialog = () => {
    const [open, setOpen] = useState(false);

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
                <CreateTaskContent closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
