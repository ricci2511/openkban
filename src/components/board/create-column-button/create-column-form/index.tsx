import PopoverPicker from '@components/ui/color-picker/popover-picker';
import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { TitleInput, columnTitle } from '@lib/schemas/board-schemas';
import useCreateColumn from '@hooks/use-create-column';
import { Button, Form } from 'react-daisyui';
import FormInputGroup from '@components/ui/form/form-input-group';
import { useBoardId } from 'store/kanban-store';
import { useTitleForm } from '@hooks/use-title-form';
import { useClickOutside } from '@hooks/use-click-outside';

const CreateColumnForm = ({
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
        <Form className="relative -mt-10 w-full" onSubmit={onSubmit} ref={ref}>
            <Form.Label
                title="Column title"
                htmlFor="column-title"
                aria-required
            />
            <FormInputGroup<TitleInput>
                type="text"
                id="column-title"
                placeholder="title..."
                className="w-full"
                register={register}
                registerName="title"
                errors={errors}
            >
                <Button
                    type="button"
                    shape="square"
                    animation={false}
                    onClick={() => setColorPickerOpen(true)}
                    aria-label="Choose a color for your new column"
                    title="Choose a color for your new column"
                >
                    <PopoverPicker
                        isOpen={colorPickerOpen}
                        toggle={setColorPickerOpen}
                        color={color}
                        changeColor={setColor}
                        className="absolute top-8 right-0"
                    />
                </Button>
            </FormInputGroup>
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

export default CreateColumnForm;
