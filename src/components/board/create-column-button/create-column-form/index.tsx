import PopoverPicker from '@components/ui/color-picker/popover-picker';
import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useKanbanStore from 'store/kanban-store';
import {
    TitleInput,
    columnTitle,
    titleSchema,
} from '@lib/schemas/board-schemas';
import useCreateColumn from '@hooks/use-create-column';
import { Button, Form } from 'react-daisyui';
import FormInputGroup from '@components/ui/form/form-input-group';

interface CreateColumnFormProps {
    setCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateColumnForm = ({ setCreating }: CreateColumnFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(columnTitle)),
    });
    const [color, setColor] = useState(
        PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
    );
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const { createColumn, isLoading } = useCreateColumn(() =>
        setCreating(false)
    );
    const boardId = useKanbanStore((state) => state.boardId);
    const onSubmit = handleSubmit(({ title }) => {
        createColumn({ boardId, title, color });
    });

    return (
        <Form className="relative -mt-10 w-full" onSubmit={onSubmit}>
            <Form.Label
                title="Column title"
                htmlFor="column-title"
                aria-required
            />
            <FormInputGroup<TitleInput>
                type="text"
                placeholder="title..."
                className="w-full"
                color={errors.title ? 'error' : undefined}
                bordered
                borderOffset
                register={register}
                registerName="title"
                errors={errors}
            >
                <span className="px-2">
                    <PopoverPicker
                        isOpen={colorPickerOpen}
                        toggle={setColorPickerOpen}
                        color={color}
                        changeColor={setColor}
                        className="absolute top-8 right-0"
                        aria-label="Choose a color for your new column"
                        title="Choose a color for your new column"
                    />
                </span>
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
                    onClick={() => setCreating(false)}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
};

export default CreateColumnForm;
