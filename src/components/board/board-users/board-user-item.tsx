import { BoardUserAvatar } from '@components/board-user-avatar';
import { ClientBoardUser } from 'types/board-types';
import {
    useBoardId,
    useBoardUserActions,
    useMyRole,
    useSetMyRole,
} from 'store/kanban-store';
import {
    DeleteBoardUserMutation,
    UpdateBoardUserMutation,
} from '@hooks/mutations/use-board-user-mutations';
import { UserRolesSelect } from './user-roles-select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import { Button } from '@components/ui/button';
import { Trash } from 'lucide-react';
import { Role } from '@prisma/client';

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

    const boardId = useBoardId();
    const { updateBoardUser, removeBoardUser } = useBoardUserActions();
    const setMyRole = useSetMyRole();

    const onRoleChange = (role: Role) => {
        updateRole(
            { boardId, boardUserId, role },
            {
                onSuccess: () => {
                    // set my new role when updating my own role
                    if (isMe) setMyRole(role);
                    // update the board user array in the store
                    updateBoardUser({ ...boardUser, role });
                },
            }
        );
    };

    const onBoardUserDelete = () => {
        // remove the board user from the store
        removeBoardUser(boardUserId);
        // delete board user api call
        deleteBoardUser({ boardId, boardUserId });
    };

    return (
        <li>
            <div className="flex items-center gap-3">
                <BoardUserAvatar boardUser={boardUser} width={36} height={36} />
                <div className="flex flex-col gap-1">
                    <span className="break-word text-sm sm:text-base">
                        {name} {isMe && '(you)'}
                    </span>
                    <span className="break-word text-xs font-light">
                        {email}
                    </span>
                </div>
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
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-1.5"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end">
                                <p className="text-sm">
                                    Remove <strong>{name}</strong> from this
                                    board?
                                </p>
                                <Button
                                    variant="destructive"
                                    className="btn-error btn-sm btn mt-2 w-full"
                                    onClick={onBoardUserDelete}
                                >
                                    Remove
                                </Button>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </li>
    );
};
