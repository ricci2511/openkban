import { useBoardUsers, useMyRole } from 'store/kanban-store';
import { BoardUserItem } from './board-user-item';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
    useDeleteBoardUser,
    useUpdateBoardUser,
} from '@hooks/mutations/use-board-user-mutations';
import { BoardUserInviteSection } from './board-user-invite-section';
import { MembersAccessSection } from './members-access-section';

export const BoardUsersContent = () => {
    const boardUsers = useBoardUsers();
    const adminCount = useMemo(
        () => boardUsers.filter((user) => user.role === 'ADMIN').length,
        [boardUsers]
    );

    const me = useSession().data!.user!;
    const isAdmin = useMyRole() === 'ADMIN';

    const { mutate: updateUserRole } = useUpdateBoardUser();
    const { mutate: deleteBoardUser } = useDeleteBoardUser();

    return (
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="users">Members</TabsTrigger>
                <TabsTrigger value="members-access" disabled={!isAdmin}>
                    Members Access
                </TabsTrigger>
                <TabsTrigger value="invite-users" disabled={!isAdmin}>
                    Invite Users
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="users"
                className="h-[246px] max-h-[246px] overflow-y-auto border-0 p-4 sm:border"
            >
                <ul className="flex flex-col gap-4">
                    {boardUsers.map((bu) => (
                        <BoardUserItem
                            key={bu.user.id}
                            boardUser={bu}
                            adminCount={adminCount}
                            isMe={bu.user.id === me.id}
                            updateRole={updateUserRole}
                            deleteBoardUser={deleteBoardUser}
                        />
                    ))}
                </ul>
            </TabsContent>
            <TabsContent
                value="members-access"
                className="h-[246px] max-h-[246px] overflow-y-auto border-0 p-4 sm:border"
            >
                <MembersAccessSection />
            </TabsContent>
            <TabsContent
                value="invite-users"
                className="h-[246px] max-h-[246px] border-0 p-4 sm:border"
            >
                <BoardUserInviteSection />
            </TabsContent>
        </Tabs>
    );
};
