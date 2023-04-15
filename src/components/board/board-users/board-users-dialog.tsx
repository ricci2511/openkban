import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { RxPerson } from 'react-icons/rx';
import { useBoardUsers, useIsAdminUser } from 'store/kanban-store';
import { BoardUserItem } from './board-user-item';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';

export const BoardUsersDialog = () => {
    const boardUsers = useBoardUsers();
    const isAdmin = useIsAdminUser();

    return (
        <Dialog>
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger
                            className="btn-outline btn-circle btn max-h-2"
                            aria-label="Open board users management dialog"
                        >
                            <RxPerson size={16} />
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent variant="info" side="left">
                        {isAdmin ? 'Manage board members' : 'Board members'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:min-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Board members</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="users">Members</TabsTrigger>
                        <TabsTrigger value="invite-users" disabled={!isAdmin}>
                            Invite new members
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="users"
                        className="max-h-[246px] overflow-y-auto p-2 sm:p-4"
                    >
                        <ul className="flex flex-col gap-4">
                            {boardUsers.map((bu) => (
                                <BoardUserItem key={bu.userId} boardUser={bu} />
                            ))}
                        </ul>
                    </TabsContent>
                    <TabsContent value="invite-users">
                        {/* TODO: USER SEARCHBAR COMPONENT */}
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Search users to invite
                        </p>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
