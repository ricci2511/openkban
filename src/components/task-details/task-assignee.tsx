import { BoardUserAvatar } from '@components/board-user-avatar';
import { BoardUserInfo } from '@components/board-user-info';
import { Button } from '@components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import { trpc } from '@lib/trpc';
import Image from 'next/image';
import {
    useBoardUsers,
    useCurrentTask,
    useMyRole,
    useTasksActions,
} from 'store/kanban-store';

export const TaskAssignee = ({ boardUserId }: { boardUserId: string }) => {
    const assignee = useBoardUsers().find((bu) => bu.id === boardUserId);
    const myRole = useMyRole();

    const task = useCurrentTask()!;
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

    if (!assignee) {
        return (
            <Image
                src=""
                alt="Unkown User"
                title="Assigned user not found"
                width={30}
                height={30}
                className="rounded-full"
            />
        );
    }

    return (
        <Popover>
            <PopoverTrigger disabled={myRole === 'VIEWER'}>
                <BoardUserAvatar boardUser={assignee} width={30} height={30} />
            </PopoverTrigger>
            <PopoverContent align="start">
                <BoardUserInfo boardUser={assignee} />
                <Button
                    variant="destructive"
                    size="sm"
                    className="btn-error btn-sm btn mt-2.5 w-full"
                    onClick={() =>
                        mutate({ boardUserId: assignee.id, taskId: task.id })
                    }
                >
                    Remove from task
                </Button>
            </PopoverContent>
        </Popover>
    );
};
