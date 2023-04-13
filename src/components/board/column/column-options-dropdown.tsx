import { BoardColumn } from '@prisma/client';
import React, { useState } from 'react';
import { RxDotsHorizontal, RxPencil1, RxTrash } from 'react-icons/rx';
import { Button, Dropdown } from 'react-daisyui';
import { columnTitle } from '@lib/schemas/board-schemas';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { DropdownButton } from '@components/ui/dropdown-button';
import { ColorPickerPopover } from '@components/color-picker-popover';
import { EditTitleDialog } from '@components/edit-title-dialog';
import { Dialog, DialogTrigger } from '@components/ui/dialog';

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

    // will be used after implementing alert dialog component
    // const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    return (
        <>
            <Dropdown vertical="end">
                <Button color="ghost" size="xs">
                    <RxDotsHorizontal size={20} />
                </Button>
                <Dropdown.Menu className="w-48 gap-1 bg-base-300">
                    <Dialog open={isEditting} onOpenChange={setIsEditting}>
                        <DialogTrigger asChild>
                            <li>
                                <DropdownButton
                                    text="Rename"
                                    startIcon={<RxPencil1 size={18} />}
                                    aria-label={`Rename ${title} column`}
                                />
                            </li>
                        </DialogTrigger>
                        <EditTitleDialog
                            entity={column}
                            updateMutation={updateColumnMutation}
                            zodString={columnTitle}
                            name="column"
                            oldTitle={title}
                            closeDialog={stopEditting}
                        />
                    </Dialog>
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
                    {/* TODO: Open alert dialog */}
                    <li>
                        <DropdownButton
                            text="Delete"
                            color="error"
                            startIcon={<RxTrash size={18} />}
                            aria-label={`Delete ${title} column`}
                        />
                    </li>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};
