import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { TitleInput, columnTitle } from '@lib/schemas/board-schemas';
import { useBoardId } from 'store/kanban-store';
import { useTitleForm } from '@hooks/use-title-form';
import { useClickOutside } from '@hooks/use-click-outside';
import { useCreateColumn } from '@hooks/mutations/use-column-mutations';
import { ColorPickerPopover } from '@components/color-picker-popover';
import { FormInput } from '@components/form-input';
import { Button } from '@components/ui/button';

export const CreateColumnForm = ({
    stopCreatingCb,
}: {
    stopCreatingCb: () => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useTitleForm(columnTitle);
    const [color, setColor] = useState(
        PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
    );
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const { mutate: createColumn, isLoading } = useCreateColumn(stopCreatingCb);
    const boardId = useBoardId();
    const onSubmit = handleSubmit(({ title }) => {
        createColumn({ boardId, title, color });
    });

    const ref = useClickOutside<HTMLFormElement>(stopCreatingCb);

    return (
        <form
            role="form"
            className="relative mt-1 w-full"
            onSubmit={onSubmit}
            ref={ref}
        >
            <div>
                <FormInput<TitleInput>
                    type="text"
                    id="column-title"
                    placeholder="column title..."
                    register={register}
                    name="title"
                    errors={errors}
                    autoFocus
                >
                    <Button
                        type="button"
                        variant="secondary"
                        className="shadow-sm"
                        onClick={() => setColorPickerOpen(true)}
                        aria-label="Choose a color for your new column"
                        title="Choose a color for your new column"
                    >
                        <ColorPickerPopover
                            isOpen={colorPickerOpen}
                            toggle={setColorPickerOpen}
                            color={color}
                            changeColor={setColor}
                            alignOffset={-14}
                        >
                            <div
                                className="h-4 w-4 rounded-lg"
                                style={{ backgroundColor: color }}
                            />
                        </ColorPickerPopover>
                    </Button>
                </FormInput>
            </div>
            <div className="mt-4 flex gap-2">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-1/2"
                    loading={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
                <Button
                    type="button"
                    className="w-1/2"
                    onClick={stopCreatingCb}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};
