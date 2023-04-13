import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { Board } from '@prisma/client';
import { boardTitle } from '@lib/schemas/board-schemas';
import { RxDotsVertical, RxExit, RxPencil1, RxTrash } from 'react-icons/rx';
import {
    useDeleteBoard,
    useUpdateBoard,
} from '@hooks/mutations/use-board-mutations';
import { useLeaveBoard } from '@hooks/mutations/use-board-user-mutations';
import { DropdownButton } from '@components/ui/dropdown-button';
import { EditTitleDialog } from '@components/edit-title-dialog';
import { Dialog, DialogTrigger } from '@components/ui/dialog';

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
        <>
            <Dropdown vertical="end">
                <Button color="ghost" className="px-1">
                    <RxDotsVertical size={19} />
                </Button>
                <Dropdown.Menu className="w-40 gap-1 bg-base-200">
                    <Dialog open={isEditting} onOpenChange={setIsEditting}>
                        <DialogTrigger asChild>
                            <li>
                                <DropdownButton
                                    text="Rename"
                                    startIcon={<RxPencil1 size={18} />}
                                    aria-label={`Rename ${title} board`}
                                />
                            </li>
                        </DialogTrigger>
                        <EditTitleDialog
                            entity={board}
                            updateMutation={updateBoardMutation}
                            zodString={boardTitle}
                            name="board"
                            oldTitle={title}
                            closeDialog={stopEditting}
                        />
                    </Dialog>
                    <li>
                        <DropdownButton
                            text="Leave"
                            color="error"
                            startIcon={<RxExit size={18} />}
                            onClick={() => leaveBoard({ boardId: id })}
                        />
                    </li>
                    {isAdmin && (
                        <li>
                            <DropdownButton
                                text="Delete"
                                color="error"
                                startIcon={<RxTrash size={18} />}
                                aria-label={`Delete ${title} board`}
                                loading={isLoading}
                                onClick={deleteBoard}
                            />
                        </li>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};
