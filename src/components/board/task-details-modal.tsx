import { TaskDetails } from '@components/task-details';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { Modal } from '@components/ui/modal';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React from 'react';
import { useSubtasksActions, useTasksActions } from 'store/kanban-store';

/**
 * @returns Modal with task details using the route as modal pattern (used in apps like Instagram and Reddit)
 */
export const TaskDetailsModal = () => {
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
        <>
            {!!id && (
                <Modal
                    open={!!id}
                    closeModal={() => router.back()}
                    className="min-h-[384px] max-w-3xl"
                >
                    {fetchStatus === 'fetching' && <LoadingSpinner centered />}
                    {subtasks && !!id && <TaskDetails />}
                </Modal>
            )}
        </>
    );
};
