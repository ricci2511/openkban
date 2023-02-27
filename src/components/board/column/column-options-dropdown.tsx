import DropdownButton from '@components/ui/buttons/dropdown-button';
import { trpc } from '@lib/trpc';
import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import useKanbanStore from 'store/kanban-store';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import PopoverPicker from '@components/ui/color-picker/popover-picker';
import { cx } from 'class-variance-authority';
import DeleteWarningModal from './delete-warning-modal';

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
    const isFirstCol = useKanbanStore((state) => state.columns[0].id === id);

    return (
        <>
            <DropdownButton
                position="end"
                labelIcon={<HiOutlineDotsHorizontal size={20} />}
                labelClassName="cursor-pointer"
                contentClassName="rounded-box gap-2 w-44 mt-2 bg-base-200 p-2 shadow"
            >
                <li>
                    <button
                        type="button"
                        aria-label="Delete task"
                        className="btn-outline btn-md font-medium"
                        onClick={toggleEdit}
                    >
                        <HiPencil size={18} />
                        Rename
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className="btn-outline btn-md font-medium"
                        onClick={() => setColorPickerOpen(true)}
                    >
                        <PopoverPicker
                            isOpen={colorPickerOpen}
                            toggle={setColorPickerOpen}
                            color={color}
                            changeColor={handleColorChange}
                            className={cx(
                                'absolute top-8',
                                isFirstCol ? '-left-3' : 'right-0'
                            )}
                        />
                        Change color
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        aria-label="Delete task"
                        className="btn-outline btn-error btn-md font-medium"
                        onClick={() => setWarningModalOpen(true)}
                    >
                        <HiTrash size={18} />
                        Delete
                    </button>
                </li>
            </DropdownButton>
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
