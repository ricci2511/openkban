import React from 'react';
import { Button, Dropdown } from 'react-daisyui';
import { HiOutlineDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';

interface OptionsDropdownProps {
    boardTitle: string;
    handleEditMode: () => void;
    deleteItem: () => void;
}

const OptionsDropdown = ({
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
                    <Button
                        variant="outline"
                        className="justify-start border-0"
                        startIcon={<HiPencil size={18} />}
                        aria-label={`Rename ${boardTitle} board`}
                        onClick={handleEditMode}
                    >
                        Rename
                    </Button>
                </li>
                <li>
                    <Button
                        variant="outline"
                        className="justify-start border-0"
                        color="error"
                        startIcon={<HiTrash size={18} />}
                        aria-label={`Delete ${boardTitle} board`}
                        onClick={deleteItem}
                    >
                        Delete
                    </Button>
                </li>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default OptionsDropdown;
