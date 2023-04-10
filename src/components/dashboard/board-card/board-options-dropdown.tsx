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
import { EditTitleModal } from '@components/edit-title-modal';

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
    const toggleEditting = () => setIsEditting(!isEditting);

    const { mutate, isLoading } = useDeleteBoard();
    const deleteBoard = () => (!isLoading ? mutate({ id }) : null);
    const { mutate: leaveBoard } = useLeaveBoard();

    const updateBoardMutation = useUpdateBoard(toggleEditting);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" className="px-1">
                    <RxDotsVertical size={19} />
                </Button>
                <Dropdown.Menu className="w-40 gap-1 bg-base-200">
                    <li>
                        <DropdownButton
                            text="Rename"
                            startIcon={<RxPencil1 size={18} />}
                            aria-label={`Rename ${title} board`}
                            onClick={toggleEditting}
                        />
                    </li>
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
            {isEditting && (
                <EditTitleModal
                    entity={board}
                    updateMutation={updateBoardMutation}
                    zodString={boardTitle}
                    name="board"
                    oldTitle={title}
                    open={isEditting}
                    closeModal={toggleEditting}
                />
            )}
        </>
    );
};
