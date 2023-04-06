import TaskDetails from '@components/task-details';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React from 'react';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import Dialog from '@components/ui/dialog';
import { useSubtasksActions, useTasksActions } from 'store/kanban-store';

/**
 * @returns Modal with task details using the route as modal pattern (used in apps like Instagram and Reddit)
 */
const TaskDetailsModal = () => {
    let router = useRouter();
    const id = router.query.taskId as string;

    const { getTaskById, setCurrentTask } = useTasksActions();
    const { setSubtasks } = useSubtasksActions();

    // isLoading is always true when the query is disabled, therefore fetchStatus is more accurate
    const { data: subtasks, fetchStatus } =
        trpc.boardSubtaskRouter.getAllByTaskId.useQuery(
            { taskId: id },
            {
                enabled: !!id,
                refetchOnWindowFocus: false,
                onSuccess: (subtasks) => {
                    const task = getTaskById(id);
                    if (task) setCurrentTask(task);
                    setSubtasks(subtasks);
                },
            }
        );

    return (
        <Dialog
            open={!!id}
            closeDialog={() => router.back()}
            className="max-w-3xl"
        >
            {fetchStatus === 'fetching' && <CustomLoadingSpinner />}
            {subtasks && !!id && <TaskDetails />}
        </Dialog>
    );
};

export default TaskDetailsModal;
