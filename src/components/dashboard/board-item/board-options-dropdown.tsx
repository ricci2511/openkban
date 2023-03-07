import DropdownButton from '@components/ui/buttons/dropdown-button';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';
import { Board } from '@prisma/client';
import EditTitleModal from '@components/ui/form/edit-title-modal';
import useUpdateBoard from '@hooks/use-update-board';
import { boardTitle } from '@lib/schemas/board-schemas';

interface OptionsDropdownProps {
    board: Board;
    removeBoard: () => void;
}

const BoardOptionsDropdown = ({ board, removeBoard }: OptionsDropdownProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const toggleEditting = () => setIsEditting(!isEditting);
    const updateBoardMutation = useUpdateBoard(toggleEditting);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" className="px-1">
                    <HiOutlineDotsVertical size={19} />
                </Button>
                <Dropdown.Menu className="w-36 gap-1 bg-base-200">
                    <li>
                        <DropdownButton
                            text="Rename"
                            startIcon={<HiPencil size={18} />}
                            aria-label={`Rename ${board.title} board`}
                            onClick={toggleEditting}
                        />
                    </li>
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<HiTrash size={18} />}
                            ariaLabel={`Delete ${board.title} board`}
                            onClick={removeBoard}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
            {isEditting && (
                <EditTitleModal
                    entity={board}
                    updateMutation={updateBoardMutation}
                    zodString={boardTitle}
                    name="board"
                    oldTitle={board.title}
                    open={isEditting}
                    closeDialog={toggleEditting}
                />
            )}
        </>
    );
};

export default BoardOptionsDropdown;
