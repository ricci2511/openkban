import DropdownButton from '@components/ui/buttons/dropdown-button';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { Board } from '@prisma/client';
import EditTitleModal from '@components/ui/form/edit-title-modal';
import useUpdateBoard from '@hooks/use-update-board';
import { boardTitle } from '@lib/schemas/board-schemas';
import useDeleteBoard from '@hooks/use-delete-board';
import { RxDotsVertical, RxExit, RxPencil1, RxTrash } from 'react-icons/rx';
import useLeaveBoard from '@hooks/use-leave-board';

interface OptionsDropdownProps {
    board: Board;
    isAdmin: boolean;
}

const BoardOptionsDropdown = ({ board, isAdmin }: OptionsDropdownProps) => {
    const { id, title } = board;
    const [isEditting, setIsEditting] = useState(false);
    const toggleEditting = () => setIsEditting(!isEditting);

    const { mutate, isLoading } = useDeleteBoard();
    const deleteBoard = () => (!isLoading ? mutate({ id }) : null);
    const { mutate: leaveBoard } = useLeaveBoard();

    const updateBoardMutation = useUpdateBoard(toggleEditting);

    const deleteLabel = !isAdmin
        ? 'Only admins can delete boards'
        : `Delete ${title} board`;
    const renameLabel = `Rename ${title} board`;

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" className="px-1">
                    <RxDotsVertical size={19} />
                </Button>
                <Dropdown.Menu className="w-40 gap-1 bg-base-200">
                    <li title={renameLabel}>
                        <DropdownButton
                            text="Rename"
                            startIcon={<RxPencil1 size={18} />}
                            aria-label={renameLabel}
                            onClick={toggleEditting}
                        />
                    </li>
                    <li title={deleteLabel}>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<RxTrash size={18} />}
                            aria-label={deleteLabel}
                            disabled={isLoading || !isAdmin}
                            loading={isLoading}
                            onClick={deleteBoard}
                        />
                    </li>
                    {!isAdmin && (
                        <li>
                            <DropdownButton
                                text="Leave"
                                color="error"
                                startIcon={<RxExit size={18} />}
                                onClick={() => leaveBoard({ boardId: id })}
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
                    closeDialog={toggleEditting}
                />
            )}
        </>
    );
};

export default BoardOptionsDropdown;
