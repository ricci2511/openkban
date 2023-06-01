import { BoardUserAvatar } from '@components/board-user-avatar';
import { BoardUserInfo } from '@components/board-user-info';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import Image from 'next/image';
import { useBoardUsers, useCurrentTask, useMyRole } from 'store/kanban-store';
import { TaskAssigneeRemoveButton } from './task-assignee-remove-button';

export const TaskAssignee = ({ boardUserId }: { boardUserId: string }) => {
    const assignee = useBoardUsers().find((bu) => bu.id === boardUserId);
    const myRole = useMyRole();
    const task = useCurrentTask()!;

    if (!assignee) {
        return (
            <Image
                src=""
                alt="Unkown User"
                title="Assigned user not found"
                width={30}
                height={30}
                className="rounded-full bg-gray-200"
            />
        );
    }

    return (
        <Popover>
            <PopoverTrigger>
                <BoardUserAvatar boardUser={assignee} width={30} height={30} />
            </PopoverTrigger>
            <PopoverContent align="start">
                <BoardUserInfo boardUser={assignee} />
                {myRole !== 'VIEWER' && (
                    <TaskAssigneeRemoveButton
                        boardUserId={boardUserId}
                        task={task}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};
