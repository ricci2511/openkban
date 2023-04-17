import { useBoardUsers, useUserRole } from 'store/kanban-store';
import { BoardUserItem } from './board-user-item';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
    useDeleteBoardUser,
    useUpdateBoardUser,
} from '@hooks/mutations/use-board-user-mutations';
import { BoardUserInviteSection } from './board-user-invite-section';

export const BoardUsersContent = () => {
    const boardUsers = useBoardUsers();
    const adminCount = useMemo(
        () => boardUsers.filter((user) => user.role === 'ADMIN').length,
        [boardUsers]
    );

    const me = useSession().data!.user!;
    const isAdmin = useUserRole() === 'ADMIN';

    const { mutate: updateUserRole } = useUpdateBoardUser();
    const { mutate: deleteBoardUser } = useDeleteBoardUser();

    return (
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="users">Members</TabsTrigger>
                <TabsTrigger value="invite-users" disabled={!isAdmin}>
                    Invite new members
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="users"
                className="max-h-[246px] min-h-[198px] overflow-y-auto border-0 p-2 sm:border sm:p-4"
            >
                <ul className="flex flex-col gap-4">
                    {boardUsers.map((bu) => (
                        <BoardUserItem
                            key={bu.userId}
                            boardUser={bu}
                            adminCount={adminCount}
                            isMe={bu.userId === me.id}
                            updateRole={updateUserRole}
                            deleteBoardUser={deleteBoardUser}
                        />
                    ))}
                </ul>
            </TabsContent>
            <TabsContent
                value="invite-users"
                className="min-h-[198px] border-0 p-2 sm:border sm:p-4"
            >
                {/* TODO: USER SEARCHBAR COMPONENT */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Search users to invite
                </p>
            </TabsContent>
        </Tabs>
    );
};
