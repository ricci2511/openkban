import React, { useState } from 'react';
import { Board } from '@prisma/client';
import { boardTitle } from '@lib/schemas/board-schemas';
import { RxDotsVertical, RxExit, RxPencil1, RxTrash } from 'react-icons/rx';
import {
    useDeleteBoard,
    useUpdateBoard,
} from '@hooks/mutations/use-board-mutations';
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
import dynamic from 'next/dynamic';

const EditTitleDialog = dynamic(
    () =>
        import('@components/edit-title-dialog').then(
            (mod) => mod.EditTitleDialog
        ),
    { ssr: false }
);

interface OptionsDropdownProps {
    board: Board;
    isAdmin: boolean;
}

export const BoardOptionsDropdown = ({
    board,
    isAdmin,
}: OptionsDropdownProps) => {
    const { id, title } = board;
    const [isEditting, setIsEditting] = useState(false);
    const stopEditting = () => setIsEditting(false);

    const { mutate, isLoading } = useDeleteBoard();
    const deleteBoard = () => (!isLoading ? mutate({ id }) : null);
    const { mutate: leaveBoard } = useLeaveBoard();

    const updateBoardMutation = useUpdateBoard(stopEditting);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="btn-ghost h-9 rounded-lg px-1">
                <RxDotsVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuLabel>{title} options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuDialogItem
                    open={isEditting}
                    onOpenChange={setIsEditting}
                    trigger={
                        <>
                            <RxPencil1 className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                        </>
                    }
                    aria-label={`Rename ${title} board`}
                >
                    <EditTitleDialog
                        entity={board}
                        updateMutation={updateBoardMutation}
                        zodString={boardTitle}
                        name="board"
                        oldTitle={title}
                        closeDialog={stopEditting}
                    />
                </DropdownMenuDialogItem>
                <DropdownMenuItem onClick={() => leaveBoard({ boardId: id })}>
                    <RxExit className="mr-2 h-4 w-4" />
                    <span>Leave</span>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem
                        className="focus:bg-red-400 dark:focus:bg-red-600"
                        aria-label={`Delete ${title} board`}
                        onClick={deleteBoard}
                    >
                        <RxTrash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
