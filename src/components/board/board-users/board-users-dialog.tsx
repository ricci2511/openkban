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
                        {isAdmin ? 'Manage board users' : 'Board users'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:min-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Board users</DialogTitle>
                </DialogHeader>
                <ul className="flex flex-col gap-4">
                    {boardUsers.map((bu) => (
                        <BoardUserItem key={bu.userId} boardUser={bu} />
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
};
