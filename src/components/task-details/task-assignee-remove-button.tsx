import { Button } from '@components/ui/button';
import { trpc } from '@lib/trpc';
import { ClientTask } from 'types/board-types';
import { getBoardId, useTasksActions } from 'store/kanban-store';

interface TaskAssigneeRemoveButtonProps {
    boardUserId: string;
    task: ClientTask;
}

export const TaskAssigneeRemoveButton = ({
    boardUserId,
    task,
}: TaskAssigneeRemoveButtonProps) => {
    const { updateTask } = useTasksActions();

    const { mutate } = trpc.boardTaskAssigneeRouter.delete.useMutation({
        onMutate: (assignee) => {
            // optimistically update the task assignees
            updateTask({
                ...task,
                assignees: task.assignees.filter(
                    (id) => id !== assignee.boardUserId
                ),
            });
        },
        onError: (err, assignee) => {
            // revert optimistic update
            updateTask({
                ...task,
                assignees: [...task.assignees, assignee.boardUserId],
            });
        },
    });

    return (
        <Button
            variant="destructive"
            size="sm"
            className="btn-error btn-sm btn mt-2.5 w-full"
            onClick={() =>
                mutate({
                    boardUserId,
                    taskId: task.id,
                    boardId: getBoardId(),
                })
            }
        >
            Remove from task
        </Button>
    );
};
