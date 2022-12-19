import DropdownButton from '@components/ui/buttons/dropdown-button';
import React from 'react';
import { HiOutlineDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';

interface OptionsDropdownProps {
    handleEditMode: () => void;
    deleteItem: () => void;
}

const OptionsDropdown = ({
    handleEditMode,
    deleteItem,
}: OptionsDropdownProps) => {
    return (
        <DropdownButton
            position="end"
            labelIcon={<HiOutlineDotsVertical size={19} />}
            labelClassName="cursor-pointer btn px-1 btn-ghost"
            contentClassName="rounded-box mt-4 w-36 gap-2 bg-base-200 p-2 shadow"
        >
            <li>
                <button
                    type="button"
                    aria-describedby="Click this to edit the selected board title"
                    className="btn-outline btn-md font-medium"
                    onClick={handleEditMode}
                >
                    <HiPencil size={18} />
                    Rename
                </button>
            </li>
            <li>
                <button
                    type="button"
                    aria-describedby="Click this to delete the selected board"
                    className="btn-outline btn-error btn-md font-medium"
                    onClick={deleteItem}
                >
                    <HiTrash size={18} />
                    Delete
                </button>
            </li>
        </DropdownButton>
    );
};

export default OptionsDropdown;
