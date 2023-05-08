import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { getBoardId, useBoardUsers } from 'store/kanban-store';
import { useCallback, useState } from 'react';
import { trpc } from '@lib/trpc';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { Role, User } from '@prisma/client';
import useDebounce from 'use-debouncy/lib/effect';
import { UserRolesSelect } from './user-roles-select';
import { UserSearchResults } from './user-search-results';
import { BoardUsersInviteList } from './board-users-invite-list';
import { useCreateBoardUsers } from '@hooks/mutations/use-board-user-mutations';
import { MAX_BOARD_USERS } from '@lib/constants';
import { Button } from '@components/ui/button';

export const BoardUserInviteSection = () => {
    const [open, setOpen] = useState(false); // user search popover state

    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const refCallback = useCallback((node: HTMLInputElement | null) => {
        if (!node) return;
        // observe width changes to keep popover width in sync with the input
        const resizeObserver = new ResizeObserver(() => {
            setPopoverWidth(node.getBoundingClientRect().width);
        });
        resizeObserver.observe(node);
        return () => resizeObserver.disconnect();
    }, []);

    const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
    const [role, setRole] = useState<Role>('MEMBER');

    // to keep track of users who are already members of the board
    const boardUserIds = useBoardUsers().map((boardUser) => boardUser.user.id);
    // to keep track of users already on the invite list
    const invitedUserIds = invitedUsers.map((u) => u.id);

    const deleteInvitedUser = (id: string) => {
        setInvitedUsers((prev) => prev.filter((user) => user.id !== id));
    };
    const handleUserSelect = (user: User) => {
        const userId = user.id;
        if (boardUserIds.includes(userId) || invitedUserIds.includes(userId))
            return;
        setInvitedUsers((prev) => [...prev, user]);
        setOpen(false);
    };

    const [nameOrEmail, setNameOrEmail] = useState('');
    // user search query
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

    // run user search query after 600ms of no input
    useDebounce(
        () => {
            if (!nameOrEmail || nameOrEmail.length < 3) {
                return;
            }
            setOpen(true);
            fetchUsers();
        },
        600,
        [nameOrEmail]
    );

    // reset state after adding users
    const onAddUsersSuccess = () => {
        setNameOrEmail('');
        setInvitedUsers([]);
    };

    const { mutate: addUsers, isLoading } =
        useCreateBoardUsers(onAddUsersSuccess);

    const inviteUsers = () => {
        if (!invitedUsers.length) return;
        const users = invitedUsers.map((user) => ({
            userId: user.id,
            role,
        }));
        // add users to board api call
        addUsers({ boardId: getBoardId(), boardUsers: users });
    };

    return (
        <div className="relative -mt-2 flex flex-col gap-1">
            <Popover open={open} onOpenChange={setOpen}>
                <Label htmlFor="user-search">User search</Label>
                <div className="flex flex-wrap gap-2">
                    <div className="flex-1">
                        <PopoverAnchor asChild>
                            <Input
                                id="user-search"
                                type="text"
                                value={nameOrEmail}
                                onChange={(e) =>
                                    setNameOrEmail(e.currentTarget.value)
                                }
                                ref={refCallback}
                                disabled={invitedUsers.length > MAX_BOARD_USERS}
                            />
                        </PopoverAnchor>
                    </div>
                    <div>
                        <UserRolesSelect
                            defaultValue={role}
                            onRoleChange={(role) => setRole(role)}
                            title="Select role for new user"
                            className="h-full min-w-[7rem]"
                            admin // no need to check since this section is only visible to admins
                        />
                    </div>
                    <Button
                        className="w-full sm:w-auto"
                        variant="success"
                        loading={isLoading}
                        onClick={inviteUsers}
                    >
                        Invite
                    </Button>
                </div>
                {invitedUsers.length > 0 && (
                    <BoardUsersInviteList
                        users={invitedUsers}
                        deleteInvitedUser={deleteInvitedUser}
                    />
                )}
                <PopoverContent
                    align="start"
                    style={{ width: popoverWidth }}
                    className="max-h-[246px]"
                >
                    {!users?.length && fetchStatus === 'idle' && (
                        <p className="text-center text-foreground/50">
                            User <strong>{nameOrEmail}</strong> not found
                        </p>
                    )}
                    {fetchStatus === 'fetching' && <LoadingSpinner centered />}
                    {users && (
                        <UserSearchResults
                            users={users}
                            handleUserSelect={handleUserSelect}
                            currentBoardUserIds={boardUserIds}
                            invitedUserIds={invitedUserIds}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};
