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
import { useUserRole } from 'store/kanban-store';
import { BoardUsersContent } from './board-users-content';

export const BoardUsersDialog = () => {
    const isAdmin = useUserRole() === 'ADMIN';

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
                <BoardUsersContent />
            </DialogContent>
        </Dialog>
    );
};
