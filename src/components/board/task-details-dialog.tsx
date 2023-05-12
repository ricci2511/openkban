import { LoadingSpinner } from '@components/ui/loading-spinner';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React from 'react';
import { useSubtasksActions, useTasksActions } from 'store/kanban-store';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { TaskDetails } from '@components/task-details';
import { ClientTask } from 'types/board-types';

interface TaskDetailsDialogProps {
    task: ClientTask;
    children: React.ReactNode; // dialog trigger
}

/**
 * @returns Dialog using the route as modal pattern to display task data.
 */
export const TaskDetailsDialog = ({
    task,
    children,
}: TaskDetailsDialogProps) => {
    let router = useRouter();
    const { boardId, taskId } = router.query;
    const open = !!taskId && task.id === taskId;

    const { setCurrentTask } = useTasksActions();
    const { setSubtasks } = useSubtasksActions();

    // isLoading is always true when the query is disabled, therefore fetchStatus is more accurate
    const { data: subtasks, fetchStatus } =
        trpc.boardSubtaskRouter.getAllByTaskId.useQuery(
            { taskId: task.id },
            {
                enabled: open,
                refetchOnWindowFocus: false,
                cacheTime: 0,
                onSuccess: (subtasks) => {
                    if (task) setCurrentTask(task);
                    setSubtasks(subtasks);
                },
            }
        );

    const onOpenChange = (open: boolean) => {
        !open ? router.push(`/board/${boardId}`) : undefined;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="min-h-[384px] sm:max-w-xl lg:max-w-2xl">
                {fetchStatus === 'fetching' && <LoadingSpinner />}
                {subtasks && <TaskDetails />}
            </DialogContent>
        </Dialog>
    );
};
