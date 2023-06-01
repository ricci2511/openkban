import { BoardUserInfo } from '@components/board-user-info';
import { trpc } from '@lib/trpc';
import { useMemo } from 'react';
import {
    getBoardId,
    useBoardUsers,
    useCurrentTask,
    useTasksActions,
} from 'store/kanban-store';

export const AssignUserContent = () => {
    const task = useCurrentTask()!;
    const boardUsers = useBoardUsers();

    const nonAssignees = useMemo(() => {
        // filter out already assigned users and viewers
        return boardUsers.filter(
            (bu) => !(task.assignees.includes(bu.id) || bu.role === 'VIEWER')
        );
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
        mutate({ boardUserId, taskId: task.id, boardId: getBoardId() });
    };

    return (
        <>
            <h3 className="text-sm font-semibold">
                Non-assigned board members
            </h3>
            <ul className="mt-2 flex max-h-44 flex-col gap-1 overflow-y-auto">
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
        </>
    );
};
