import TaskDetails from '@components/task-details';
import Modal from '@components/ui/modal';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import useKanbanStore from 'store/kanban-store';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';

/**
 *
 * @returns Modal with task details using the route as modal pattern (used in apps like Instagram and Reddit)
 */
const TaskDetailsModal = () => {
    let router = useRouter();
    const id = router.query.taskId as string;
    const task = useKanbanStore((state) => state.getTaskById(id));
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
        <Modal
            isOpen={!!id}
            toggleModal={() => router.back()}
            maxWidth="threeXl"
        >
            {isLoading && <CustomLoadingSpinner />}
            {taskWithSubtasks && !!id && (
                <TaskDetails task={taskWithSubtasks} />
            )}
        </Modal>
    );
};

export default TaskDetailsModal;
