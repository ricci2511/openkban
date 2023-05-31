import { BoardUserInfo } from '@components/board-user-info';
import { Button } from '@components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import { trpc } from '@lib/trpc';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import {
    useBoardUsers,
    useCurrentTask,
    useTasksActions,
} from 'store/kanban-store';

export const AssignUserButton = () => {
    const task = useCurrentTask()!;
    const boardUsers = useBoardUsers();

    const nonAssignees = useMemo(() => {
        return boardUsers.filter((bu) => !task.assignees.includes(bu.id));
    }, [boardUsers, task.assignees]);

    const { updateTask } = useTasksActions();

    const { mutate } = trpc.boardTaskAssigneeRouter.create.useMutation({
        onMutate: (newAssignee) => {
            // optimistically update the task assignees
            updateTask({
                ...task,
                assignees: [...task.assignees, newAssignee.boardUserId],
            });
        },
        onError: (err, newAssignee) => {
            // revert optimistic update
            updateTask({
                ...task,
                assignees: task.assignees.filter(
                    (id) => id !== newAssignee.boardUserId
                ),
            });
        },
    });

    const handleAssignUser = (boardUserId: string) => {
        mutate({ boardUserId, taskId: task.id });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full" size="sm">
                    <Plus className="h-3 w-3" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <h3 className="text-sm font-semibold">
                    Non-assigned board members
                </h3>
                <ul className="mt-2">
                    {!nonAssignees.length && (
                        <p className="text-sm text-muted-foreground">
                            No more board members left to assign.
                        </p>
                    )}
                    {nonAssignees.map((bu) => (
                        <li
                            key={bu.id}
                            className="flex cursor-pointer items-center gap-3 rounded-md p-1 transition-all duration-200 hover:bg-muted"
                            onClick={() => handleAssignUser(bu.id)}
                        >
                            <BoardUserInfo
                                boardUser={bu}
                                avatarWidth={32}
                                avatarHeight={32}
                            />
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
};
