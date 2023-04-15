import { BoardUserAvatar } from '@components/board-user-avatar';
import { BoardUserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ClientBoardUser } from 'types/board-types';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectGroup,
} from '@components/ui/select';
import { useBoardUsers, useIsAdminUser } from 'store/kanban-store';
import { RxTrash } from 'react-icons/rx';

const boardUserRoles = Object.values(BoardUserRole);

export const BoardUserItem = ({
    boardUser,
}: {
    boardUser: ClientBoardUser;
}) => {
    const { role, user, userId } = boardUser;
    const amIAdmin = useIsAdminUser();
    const boardUsers = useBoardUsers();

    const me = useSession().data!.user!;

    const amIBoardUser = userId === me.id;
    const isBoardUserAdmin = role === 'ADMIN';

    const adminCount = boardUsers.filter((bu) => bu.role === 'ADMIN').length;

    // Disable select if:
    // - The current board user is an admin and I am not.
    // - I am not the current board user and I am not an admin.
    // - There is only one admin, because at least one admin is required.
    const disableSelect =
        ((isBoardUserAdmin || !amIBoardUser) && !amIAdmin) ||
        (adminCount === 1 && isBoardUserAdmin);

    const triggerTitle = () => {
        if (!disableSelect) return;

        if (isBoardUserAdmin && !amIAdmin) {
            return 'You cannot change the role of an admin';
        }
        if (adminCount === 1 && isBoardUserAdmin) {
            return 'At least one admin is required';
        }
        if (!amIBoardUser && !amIAdmin) {
            return 'You cannot change the role of other members';
        }
    };

    return (
        <li>
            <div className="flex items-center gap-3">
                <BoardUserAvatar boardUser={boardUser} width={36} height={36} />
                <div className="flex flex-col gap-1">
                    <span>
                        {user.name} {amIBoardUser && '(you)'}
                    </span>
                    <span className="text text-xs font-light">
                        {user.email}
                    </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue={role} disabled={disableSelect}>
                        <SelectTrigger
                            className="min-w-[8rem]"
                            title={triggerTitle()}
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
                    {amIAdmin && !amIBoardUser && (
                        <button className="btn-error btn-sm btn px-1.5">
                            <RxTrash size={16} />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};
