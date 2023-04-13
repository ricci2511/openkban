import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { TitleInput, columnTitle } from '@lib/schemas/board-schemas';
import { Button, Form } from 'react-daisyui';
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
        <Form className="relative mt-1 w-full" onSubmit={onSubmit} ref={ref}>
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
                    <Button
                        type="button"
                        shape="square"
                        animation={false}
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
                    </Button>
                </FormInput>
            </div>
            <div className="mt-4 flex gap-2">
                <Button
                    type="submit"
                    className="w-1/2"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
                <Button
                    type="button"
                    className="w-1/2"
                    color="error"
                    onClick={stopCreatingCb}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
};
