import { BoardUserAvatar } from '@components/board-user-avatar';
import { ClientBoardUser } from 'types/board-types';
import { useMyRole, useSetMyRole, getBoardId } from 'store/kanban-store';
import {
    DeleteBoardUserMutation,
    UpdateBoardUserMutation,
} from '@hooks/mutations/use-board-user-mutations';
import { UserRolesSelect } from './user-roles-select';
import { Role } from '@prisma/client';
import { DeleteButtonWithPopover } from '@components/delete-button-with-popover';
import { BoardUserInfo } from '@components/board-user-info';

interface BoardUserItemProps {
    boardUser: ClientBoardUser;
    adminCount: number;
    isMe: boolean;
    updateRole: UpdateBoardUserMutation['mutate'];
    deleteBoardUser: DeleteBoardUserMutation['mutate'];
}

export const BoardUserItem = ({
    boardUser,
    adminCount,
    isMe,
    updateRole,
    deleteBoardUser,
}: BoardUserItemProps) => {
    const {
        id: boardUserId,
        role,
        user: { email, name },
    } = boardUser;
    const isBoardUserAdmin = role === 'ADMIN';

    const myRole = useMyRole();
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

    /**
     * iife to immediately return the title attribute for the select button
     * @returns Title attribute for the select button to explain why it is disabled or undefined
     */
    const triggerTitle = (() => {
        if (!disableSelect) return;

        if (amIViewer)
            return 'Viewers cannot change their or other members role';

        if (amIMember) return 'Members cannot change other members role';

        if (adminCount === 1 && isBoardUserAdmin) {
            return 'At least one admin is required';
        }
    })();

    const setMyRole = useSetMyRole();

    const onRoleChange = (role: Role) => {
        updateRole({ boardId: getBoardId(), boardUserId, role });
        // when changing my own role, set my new role in the store
        if (isMe) setMyRole(role);
    };

    const onBoardUserDelete = () => {
        deleteBoardUser({ boardId: getBoardId(), boardUserId });
    };

    return (
        <li>
            <div className="flex items-center gap-3">
                <BoardUserInfo boardUser={boardUser} isMe={isMe} />
                <div className="ml-auto flex items-center gap-2">
                    <UserRolesSelect
                        admin={amIAdmin}
                        defaultValue={role}
                        disabled={disableSelect}
                        onRoleChange={onRoleChange}
                        className="min-w-[8rem]"
                        title={triggerTitle}
                    />
                    {amIAdmin && !isMe && (
                        <DeleteButtonWithPopover
                            variant="outline"
                            size="sm"
                            className="px-1.5"
                            onDelete={onBoardUserDelete}
                        >
                            Remove <strong>{name}</strong> from this board?
                        </DeleteButtonWithPopover>
                    )}
                </div>
            </div>
        </li>
    );
};
