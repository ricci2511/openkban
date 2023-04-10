import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import { HiOutlineDotsHorizontal, HiPencil, HiTrash } from 'react-icons/hi';
import { Button, Dropdown } from 'react-daisyui';
import { columnTitle } from '@lib/schemas/board-schemas';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { DropdownButton } from '@components/ui/dropdown-button';
import { ColorPickerPopover } from '@components/color-picker-popover';
import { EditTitleModal } from '@components/edit-title-modal';
import { DeleteWarningModal } from './delete-warning-modal';

interface ColumnOptionsDropdownProps {
    column: BoardColumn;
}

export const ColumnOptionsDropdown = ({
    column,
}: ColumnOptionsDropdownProps) => {
    const { id, color, title } = column;

    const [isEditting, setIsEditting] = useState(false);
    const stopEditting = () => setIsEditting(false);
    // same mutation is used for updating title and color, stopEditting cb is only passed when updating title
    const updateColumnMutation = useUpdateColumn(
        isEditting ? stopEditting : undefined
    );

    const handleColorChange = (newColor: string) => {
        const { mutate: updateCol, isLoading } = updateColumnMutation;
        // prevent updating if color is the same or if already mutating
        if (color === newColor || isLoading) return;
        updateCol({
            id,
            color: newColor,
        });
    };

    const [warningDialogOpen, setWarningModalOpen] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" size="xs">
                    <HiOutlineDotsHorizontal size={20} />
                </Button>
                <Dropdown.Menu className="w-48 gap-1 bg-base-300">
                    <li>
                        <DropdownButton
                            text="Rename"
                            startIcon={<HiPencil size={18} />}
                            aria-label={`Rename ${title} column`}
                            onClick={() => setIsEditting(true)}
                        />
                    </li>
                    <li>
                        <DropdownButton
                            text="Change color"
                            startIcon={
                                <ColorPickerPopover
                                    isOpen={colorPickerOpen}
                                    toggle={setColorPickerOpen}
                                    color={color}
                                    changeColor={handleColorChange}
                                    className="absolute top-9 -left-7"
                                />
                            }
                            animation={false}
                            aria-label={`Change color of ${title} column`}
                            onClick={() => setColorPickerOpen(true)}
                        />
                    </li>
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<HiTrash size={18} />}
                            aria-label={`Delete ${title} column`}
                            onClick={() => setWarningModalOpen(true)}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
            {isEditting && (
                <EditTitleModal
                    entity={column}
                    updateMutation={updateColumnMutation}
                    zodString={columnTitle}
                    name="column"
                    oldTitle={title}
                    open={isEditting}
                    closeModal={stopEditting}
                />
            )}
            {warningDialogOpen && (
                <DeleteWarningModal
                    title={title}
                    columnId={id}
                    open={warningDialogOpen}
                    closeModal={() => setWarningModalOpen(false)}
                />
            )}
        </>
    );
};
