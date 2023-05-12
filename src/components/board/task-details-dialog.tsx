import { useRouter } from 'next/router';
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { TaskDetailsDialogContent } from './task-details-dialog-content';

interface TaskDetailsDialogProps {
    taskId: string; // task id to check if it matches the with the task id in the route
    columnId: string; // id of the column the task belongs to
    children: React.ReactNode; // dialog trigger
}

/**
 * @returns Dialog using the route as modal pattern to display task data.
 */
export const TaskDetailsDialog = ({
    taskId,
    columnId,
    children,
}: TaskDetailsDialogProps) => {
    const router = useRouter();
    const { boardId, taskId: taskIdQuery } = router.query;

    // open the dialog if the task id in the route matches the task id of the task
    const open = !!taskIdQuery && taskIdQuery === taskId;

    const onOpenChange = (open: boolean) => {
        !open ? router.push(`/board/${boardId}`) : undefined;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="min-h-[384px] sm:max-w-xl lg:max-w-2xl">
                <TaskDetailsDialogContent taskId={taskId} columnId={columnId} />
            </DialogContent>
        </Dialog>
    );
};
