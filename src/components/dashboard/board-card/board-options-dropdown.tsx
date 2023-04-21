import React, { useState } from 'react';
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
    isAdmin: boolean;
    startEditting: () => void;
}

export const BoardOptionsDropdown = ({
    board,
    isAdmin,
    startEditting,
}: OptionsDropdownProps) => {
    const { id, title } = board;

    const { mutate: leaveBoard } = useLeaveBoard();

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
                <DropdownMenuItem
                    onClick={startEditting}
                    aria-label={`Rename ${title} board`}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => leaveBoard({ boardId: id })}>
                    <DoorOpen className="mr-2 h-4 w-4" />
                    <span>Leave</span>
                </DropdownMenuItem>
                {isAdmin && (
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
                        <DeleteBoardAlertDialog
                            boardId={id}
                            title={title}
                            closeAlert={() => setIsDeleting(false)}
                        />
                    </DropdownMenuDialogItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
