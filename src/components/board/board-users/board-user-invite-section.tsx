import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { useBoardUsers } from 'store/kanban-store';
import { useCallback, useMemo, useState } from 'react';
import { trpc } from '@lib/trpc';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { User } from '@prisma/client';
import useDebounce from 'use-debouncy/lib/effect';
import { UserRolesSelect } from './user-roles-select';
import { UserSearchResults } from './user-search-results';
import { BoardUsersInviteList } from './board-users-invite-list';

export const BoardUserInviteSection = () => {
    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const refCallback = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;
        // observe width changes to keep popover width in sync with the input
        const resizeObserver = new ResizeObserver(() => {
            setPopoverWidth(node.getBoundingClientRect().width);
        });
        resizeObserver.observe(node);
        return () => resizeObserver.disconnect();
    }, []);

    // popover state
    const [open, setOpen] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState<User[]>([]);

    // to keep track of users who are already members of the board
    const boardUserIdsSet = new Set(
        useBoardUsers().map((boardUser) => boardUser.userId)
    );
    // to keep track of users already invited when adding new users
    const invitedUserIdsSet = useMemo(
        () => new Set(invitedUsers.map((u) => u.id)),
        [invitedUsers]
    );

    const deleteInvitedUser = (id: string) => {
        setInvitedUsers((prev) => prev.filter((user) => user.id !== id));
    };
    const handleUserSelect = (user: User) => {
        const userId = user.id;
        if (boardUserIdsSet.has(userId) || invitedUserIdsSet.has(userId))
            return;
        setInvitedUsers((prev) => [...prev, user]);
        setOpen(false);
    };

    // search input state
    const [nameOrEmail, setNameOrEmail] = useState('');
    const {
        data: users,
        fetchStatus,
        refetch: fetchUsers,
    } = trpc.userRouter.searchUsers.useQuery(
        {
            nameOrEmail,
        },
        {
            enabled: false,
        }
    );

    const searchUsers = () => {
        if (!nameOrEmail || nameOrEmail.length < 3) {
            return;
        }
        setOpen(true);
        fetchUsers();
    };
    // run searchUsers cb after 500ms of no input
    useDebounce(searchUsers, 500, [nameOrEmail]);

    // TODO: add board user create mutation
    const inviteUsers = () => {
        setNameOrEmail('');
        setInvitedUsers([]);
    };

    return (
        <div className="relative -mt-2 flex flex-col">
            <Popover open={open} onOpenChange={setOpen}>
                <Label htmlFor="user-search">User search</Label>
                <div className="flex flex-wrap gap-2">
                    <div className="flex-1">
                        <PopoverAnchor asChild>
                            <Input
                                id="user-search"
                                type="text"
                                onChange={(e) =>
                                    setNameOrEmail(e.currentTarget.value)
                                }
                                ref={refCallback}
                                disabled={invitedUsers.length > 5}
                            />
                        </PopoverAnchor>
                    </div>
                    <div>
                        <UserRolesSelect
                            defaultValue="MEMBER"
                            title="Select role for new user"
                            className="h-full min-w-[7rem]"
                            admin // no need to check since this section is only visible to admins
                        />
                    </div>
                    <button
                        className="btn w-full sm:w-auto"
                        onClick={inviteUsers}
                    >
                        Invite
                    </button>
                </div>
                {invitedUsers.length > 0 && (
                    <BoardUsersInviteList
                        users={invitedUsers}
                        deleteInvitedUser={deleteInvitedUser}
                    />
                )}
                <PopoverContent align="start" style={{ width: popoverWidth }}>
                    {!users?.length && fetchStatus === 'idle' && (
                        <p className="text-center text-gray-500 dark:text-gray-200">
                            User <strong>{nameOrEmail}</strong> not found
                        </p>
                    )}
                    {fetchStatus === 'fetching' && <LoadingSpinner centered />}
                    {users && (
                        <UserSearchResults
                            users={users}
                            handleUserSelect={handleUserSelect}
                            currentBoardUserIds={boardUserIdsSet}
                            invitedUserIds={invitedUserIdsSet}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};
