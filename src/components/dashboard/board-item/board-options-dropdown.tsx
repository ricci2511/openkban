import DropdownButton from '@components/ui/buttons/dropdown-button';
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';
import BoardEditTitleModal from './board-edit-title-modal';
import { Board } from '@prisma/client';

interface OptionsDropdownProps {
    board: Board;
    removeBoard: () => void;
}

const BoardOptionsDropdown = ({ board, removeBoard }: OptionsDropdownProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const toggleEditting = () => setIsEditting(!isEditting);

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
                <BoardEditTitleModal
                    board={board}
                    isEditting={isEditting}
                    toggleEditting={toggleEditting}
                />
            )}
        </>
    );
};

export default BoardOptionsDropdown;
