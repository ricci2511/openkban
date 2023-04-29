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
import { BoardUsersContent } from './board-users-content';
import { Button } from '@components/ui/button';
import { User } from 'lucide-react';
import { useMyRole } from 'store/kanban-store';

export const BoardUsersDialog = () => {
    const isAdmin = useMyRole() === 'ADMIN';

    return (
        <Dialog>
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-full">
                                <User className="h-4 w-4" />
                            </Button>
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
