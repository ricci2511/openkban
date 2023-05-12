import { TaskDetails } from '@components/task-details';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { trpc } from '@lib/trpc';
import { useSubtasksActions, useSetCurrTaskRef } from 'store/kanban-store';

interface TaskDetailsDialogContentProps {
    taskId: string;
    columnId: string;
}

export const TaskDetailsDialogContent = ({
    taskId,
    columnId,
}: TaskDetailsDialogContentProps) => {
    const { setSubtasks } = useSubtasksActions();
    const setCurrTaskRef = useSetCurrTaskRef();

    // query the subtasks of the current task
    const { fetchStatus } = trpc.boardSubtaskRouter.getAllByTaskId.useQuery(
        { taskId },
        {
            refetchOnWindowFocus: false,
            cacheTime: 0,
            onSuccess: (subtasks) => {
                // set the reference to the current task for quick access to the task data
                setCurrTaskRef(columnId, taskId);
                // set the data of the tasks subtasks in the store
                setSubtasks(subtasks);
            },
        }
    );

    // isLoading is always true when the query is disabled, therefore fetchStatus is more accurate
    if (fetchStatus === 'fetching') {
        return <LoadingSpinner />;
    }

    return <TaskDetails />;
};
