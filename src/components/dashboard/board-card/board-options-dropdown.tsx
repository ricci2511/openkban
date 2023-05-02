import React, { Suspense, useState } from 'react';
import { Board } from '@prisma/client';
import { useLeaveBoard } from '@hooks/mutations/use-board-user-mutations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuDialogItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { DoorOpen, MoreVertical, Pencil, Trash, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@components/ui/loading-spinner';

const DeleteBoardAlertDialog = dynamic(
    () =>
        import('./delete-board-alert-dialog').then(
            (mod) => mod.DeleteBoardAlertDialog
        ),
    {
        ssr: false,
    }
);

interface OptionsDropdownProps {
    board: Board;
    boardUserId: string;
    isAdmin: boolean;
    startEditting: () => void;
}

export const BoardOptionsDropdown = ({
    board,
    boardUserId,
    isAdmin,
    startEditting,
}: OptionsDropdownProps) => {
    const { id, title } = board;

    const { mutate: leaveBoard } = useLeaveBoard();
    const onLeaveBoard = () => leaveBoard({ boardId: board.id, boardUserId });

    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-1 px-0">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="max-w-[10rem]"
            >
                <DropdownMenuLabel>Board options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            onClick={startEditting}
                            aria-label={`Rename ${title} board`}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuDialogItem
                            open={isDeleting}
                            onOpenChange={setIsDeleting}
                            aria-label={`Delete ${title} task`}
                            trigger={
                                <>
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </>
                            }
                            alert
                            destructive
                        >
                            <Suspense fallback={<LoadingSpinner centered />}>
                                <DeleteBoardAlertDialog
                                    boardId={id}
                                    title={title}
                                    closeAlert={() => setIsDeleting(false)}
                                />
                            </Suspense>
                        </DropdownMenuDialogItem>
                    </>
                )}
                <DropdownMenuItem onClick={onLeaveBoard}>
                    <DoorOpen className="mr-2 h-4 w-4" />
                    <span>Leave</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
