import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { TitleInput, columnTitle } from '@lib/schemas/board-schemas';
import { useBoardId } from 'store/kanban-store';
import { useTitleForm } from '@hooks/use-title-form';
import { useClickOutside } from '@hooks/use-click-outside';
import { useCreateColumn } from '@hooks/mutations/use-column-mutations';
import { ColorPickerPopover } from '@components/color-picker-popover';
import { FormInput } from '@components/ui/form-input';

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
                    registerName="title"
                    errors={errors}
                    autoFocus
                >
                    <button
                        type="button"
                        className="no-animation btn-square btn"
                        onClick={() => setColorPickerOpen(true)}
                        aria-label="Choose a color for your new column"
                        title="Choose a color for your new column"
                    >
                        <ColorPickerPopover
                            isOpen={colorPickerOpen}
                            toggle={setColorPickerOpen}
                            color={color}
                            changeColor={setColor}
                            className="absolute top-8 right-0"
                        />
                    </button>
                </FormInput>
            </div>
            <div className="mt-4 flex gap-2">
                <button
                    type="submit"
                    className={`btn-primary btn w-1/2 ${
                        isLoading && 'loading'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
                <button
                    type="button"
                    className="btn-error btn w-1/2"
                    onClick={stopCreatingCb}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
