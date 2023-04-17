import { LoadingSpinner } from '@components/ui/loading-spinner';
import { trpc } from '@lib/trpc';
import { BoardTask } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useSubtasksActions, useTasksActions } from 'store/kanban-store';
import { DialogContent } from '@components/ui/dialog';
import dynamic from 'next/dynamic';

const TaskDetails = dynamic(
    () => import('@components/task-details').then((mod) => mod.TaskDetails),
    { ssr: false }
);

/**
 * @returns Dialog using the route as modal pattern to display task data.
 */
export const TaskDetailsDialogContent = ({ task }: { task: BoardTask }) => {
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

    const onClose = () => router.push(`/board/${boardId}`);

    return (
        <DialogContent
            className="min-h-[384px] sm:max-w-xl lg:max-w-2xl"
            onPointerDownOutside={onClose} // triggers when clicking outside of the dialog
            onCloseAutoFocus={onClose} // triggers when clicking the close button
            onEscapeKeyDown={onClose}
        >
            {fetchStatus === 'fetching' && <LoadingSpinner centered />}
            {subtasks && open && <TaskDetails />}
        </DialogContent>
    );
};
