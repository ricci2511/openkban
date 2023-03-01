import { trpc } from '@lib/trpc';
import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import useKanbanStore from 'store/kanban-store';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import PopoverPicker from '@components/ui/color-picker/popover-picker';
import DeleteWarningModal from './delete-warning-modal';
import { Button, Dropdown } from 'react-daisyui';

interface ColumnOptionsDropdownProps {
    column: BoardColumn;
    toggleEdit: () => void;
}
const ColumnOptionsDropdown = ({
    column,
    toggleEdit,
}: ColumnOptionsDropdownProps) => {
    const { id, color, title } = column;
    const { mutate: updateColumn, error: updateErr } =
        trpc.boardColumnRouter.update.useMutation();

    const updateStoreCol = useKanbanStore((state) => state.updateColumn);
    const handleColorChange = (newColor: string) => {
        if (color === newColor) return;
        // update column color in kanban store and db
        updateStoreCol({ ...column, color: newColor });
        updateColumn({
            id,
            color: newColor,
        });
    };

    const [warningModalOpen, setWarningModalOpen] = useState(false);
    const toggleWarningModal = () => setWarningModalOpen(!warningModalOpen);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" size="xs">
                    <HiOutlineDotsHorizontal size={20} />
                </Button>
                <Dropdown.Menu className="w-48 gap-1 bg-base-300">
                    <li>
                        <Button
                            variant="outline"
                            className="justify-start border-0"
                            startIcon={<HiPencil size={18} />}
                            aria-label={`Rename ${title} column`}
                            onClick={toggleEdit}
                        >
                            Rename
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outline"
                            className="justify-start border-0"
                            startIcon={
                                <PopoverPicker
                                    isOpen={colorPickerOpen}
                                    toggle={setColorPickerOpen}
                                    color={color}
                                    changeColor={handleColorChange}
                                    className="absolute top-9 -left-7"
                                />
                            }
                            aria-label={`Change color of ${title} column`}
                            onClick={() => setColorPickerOpen(true)}
                        >
                            Change color
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outline"
                            className="justify-start border-0"
                            color="error"
                            startIcon={<HiTrash size={18} />}
                            aria-label={`Delete ${title} column`}
                            onClick={() => setWarningModalOpen(true)}
                        >
                            Delete
                        </Button>
                    </li>
                </Dropdown.Menu>
            </Dropdown>
            {warningModalOpen && (
                <DeleteWarningModal
                    title={title}
                    columnId={id}
                    isOpen={warningModalOpen}
                    toggleModal={toggleWarningModal}
                />
            )}
        </>
    );
};

export default ColumnOptionsDropdown;
