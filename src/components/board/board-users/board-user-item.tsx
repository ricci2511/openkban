import { BoardUserAvatar } from '@components/board-user-avatar';
import { BoardUserRole } from '@prisma/client';
import { ClientBoardUser } from 'types/board-types';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectGroup,
} from '@components/ui/select';
import { RxTrash } from 'react-icons/rx';
import { useUserRole } from 'store/kanban-store';

const boardUserRoles = Object.values(BoardUserRole);

interface BoardUserItemProps {
    boardUser: ClientBoardUser;
    adminCount: number;
    isMe: boolean;
}

export const BoardUserItem = ({
    boardUser,
    adminCount,
    isMe,
}: BoardUserItemProps) => {
    const {
        role,
        user: { email, name },
    } = boardUser;
    const isBoardUserAdmin = role === 'ADMIN';

    const myRole = useUserRole();
    const amIAdmin = myRole === 'ADMIN';
    const amIMember = myRole === 'MEMBER';
    const amIViewer = myRole === 'VIEWER';

    // Disable select if:
    // - I am not the current board user and I am a member (only their own role can be changed).
    // - There is only one admin, because at least one admin is required.
    // - The current board user is a viewer (cannot change any role)
    const disableSelect =
        (!isMe && amIMember) ||
        (adminCount === 1 && isBoardUserAdmin) ||
        amIViewer;

    const getTriggerTitle = () => {
        if (!disableSelect) return;

        if (amIViewer)
            return 'Viewers cannot change their or other members role';

        if (amIMember) return 'Members cannot change other members role';

        if (adminCount === 1 && isBoardUserAdmin) {
            return 'At least one admin is required';
        }
    };
    const triggerTitle = getTriggerTitle();

    return (
        <li>
            <div className="flex items-center gap-3">
                <BoardUserAvatar boardUser={boardUser} width={36} height={36} />
                <div className="flex flex-col gap-1">
                    <span>
                        {name} {isMe && '(you)'}
                    </span>
                    <span className="text text-xs font-light">{email}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue={role} disabled={disableSelect}>
                        <SelectTrigger
                            className="min-w-[8rem]"
                            title={triggerTitle}
                        >
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {boardUserRoles.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}
                                        disabled={role === 'ADMIN' && !amIAdmin}
                                    >
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {amIAdmin && !isMe && (
                        <button className="btn-error btn-sm btn px-1.5">
                            <RxTrash size={16} />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};
