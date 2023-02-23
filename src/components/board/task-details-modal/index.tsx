import TaskDetails from '@components/task-details';
import Modal from '@components/ui/modal';
import { useRouter } from 'next/router';
import React from 'react';
import useKanbanStore from 'store/kanban-store';

/**
 *
 * @returns Modal with task details using the route as modal pattern (used in apps like Instagram and Reddit)
 */
const TaskDetailsModal = () => {
    let router = useRouter();
    const id = router.query.taskId as string;
    const task = useKanbanStore((state) => state.getTaskById(id));

    return (
        <Modal isOpen={!!id} toggleModal={() => router.back()} maxWidth="full">
            {task && <TaskDetails task={task} />}
        </Modal>
    );
};

export default TaskDetailsModal;
