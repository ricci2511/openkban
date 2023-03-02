import DropdownButton from '@components/ui/buttons/dropdown-button';
import React from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';

interface OptionsDropdownProps {
    boardTitle: string;
    handleEditMode: () => void;
    deleteItem: () => void;
}

const BoardOptionsDropdown = ({
    boardTitle,
    handleEditMode,
    deleteItem,
}: OptionsDropdownProps) => {
    return (
        <Dropdown vertical="end">
            <Button color="ghost" className="px-1">
                <HiOutlineDotsVertical size={19} />
            </Button>
            <Dropdown.Menu className="w-36 gap-1 bg-base-200">
                <li>
                    <DropdownButton
                        text="Rename"
                        startIcon={<HiPencil size={18} />}
                        aria-label={`Rename ${boardTitle} board`}
                        onClick={handleEditMode}
                    />
                </li>
                <li>
                    <DropdownButton
                        text="Delete"
                        color="error"
                        startIcon={<HiTrash size={18} />}
                        ariaLabel={`Delete ${boardTitle} task`}
                        onClick={deleteItem}
                    />
                </li>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default BoardOptionsDropdown;
