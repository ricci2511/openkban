import TaskDetails from '@components/task-details';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import Dialog from '@components/ui/dialog';
import { useTasksActions } from 'store/columns-tasks-store';

/**
 * @returns Modal with task details using the route as modal pattern (used in apps like Instagram and Reddit)
 */
const TaskDetailsModal = () => {
    let router = useRouter();
    const id = router.query.taskId as string;
    const task = useTasksActions().getTaskById(id);
    const {
        data: subtasks,
        isLoading,
        error,
    } = trpc.boardTaskSubtaskRouter.getAllByTaskId.useQuery(
        { taskId: id },
        { enabled: !!id }
    );

    const taskWithSubtasks = useMemo(
        () => (task && subtasks ? { ...task, subtasks } : null),
        [subtasks, task]
    );

    return (
        <Dialog
            open={!!id}
            closeDialog={() => router.back()}
            className="max-w-4xl"
        >
            {isLoading && <CustomLoadingSpinner />}
            {taskWithSubtasks && !!id && (
                <TaskDetails task={taskWithSubtasks} />
            )}
        </Dialog>
    );
};

export default TaskDetailsModal;
