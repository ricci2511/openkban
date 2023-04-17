import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import {
    useBoardId,
    useBoardUserActions,
    useBoardUsers,
} from 'store/kanban-store';
import { useCallback, useState } from 'react';
import { trpc } from '@lib/trpc';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { BoardUserRole, User } from '@prisma/client';
import useDebounce from 'use-debouncy/lib/effect';
import { UserRolesSelect } from './user-roles-select';
import { UserSearchResults } from './user-search-results';
import { BoardUsersInviteList } from './board-users-invite-list';
import { useCreateBoardUser } from '@hooks/mutations/use-board-user-mutations';
import { ClientBoardUser } from 'types/board-types';
import { MAX_BOARD_USERS } from '@lib/constants';

export const BoardUserInviteSection = () => {
    const [open, setOpen] = useState(false); // popover open state
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
    const [role, setRole] = useState<BoardUserRole>('MEMBER');

    // to keep track of users who are already members of the board
    const boardUserIds = useBoardUsers().map((boardUser) => boardUser.userId);
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
    // run searchUsers cb after 600ms of no input
    useDebounce(searchUsers, 600, [nameOrEmail]);

    const { addBoardUsers } = useBoardUserActions();
    const onAddUsersSuccess = () => {
        // add users to kanban store
        const newBoardUsers: ClientBoardUser[] = invitedUsers.map(
            ({ emailVerified, ...user }) => {
                return {
                    userId: user.id,
                    user,
                    role,
                    isFavourite: false,
                };
            }
        );
        addBoardUsers(newBoardUsers);

        // reset state
        setNameOrEmail('');
        setInvitedUsers([]);
    };

    const { mutate: addUsers, isLoading } =
        useCreateBoardUser(onAddUsersSuccess);

    const boardId = useBoardId();

    const inviteUsers = () => {
        if (!invitedUsers.length) return;
        const users = invitedUsers.map((user) => ({
            userId: user.id,
            role,
            boardId,
        }));
        // add users to board api call
        addUsers(users);
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
                    <button
                        className={`btn w-full sm:w-auto ${
                            isLoading && 'loading'
                        }`}
                        disabled={isLoading}
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
                            currentBoardUserIds={boardUserIds}
                            invitedUserIds={invitedUserIds}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};
