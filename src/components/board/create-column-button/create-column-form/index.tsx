import PopoverPicker from '@components/ui/color-picker/popover-picker';
import { PRESET_COLORS } from '@lib/constants';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useKanbanStore from 'store/kanban-store';
import { cx } from 'class-variance-authority';
import {
    TitleInput,
    columnTitle,
    titleSchema,
} from '@lib/schemas/board-schemas';
import useCreateColumn from '@hooks/use-create-column';

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

    const { createColumn, isLoading, error } = useCreateColumn(() =>
        setCreating(false)
    );
    const boardId = useKanbanStore((state) => state.boardId);
    const onSubmit = handleSubmit(({ title }) => {
        createColumn({ boardId, title, color });
    });

    return (
        <form
            className="form-control relative -mt-10 w-full"
            onSubmit={onSubmit}
        >
            <label className="label">
                <span className="label-text" aria-required>
                    Column title
                </span>
            </label>
            <label className="input-group">
                <input
                    type="text"
                    placeholder="Testing"
                    className={cx(
                        'input-bordered input w-full',
                        errors.title && 'input-error'
                    )}
                    {...register('title', { required: true })}
                />
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
            </label>
            {errors.title && (
                <p className="mt-2 text-sm text-error">
                    {errors.title.message}
                </p>
            )}
            <div className="mt-4 flex gap-2">
                <button
                    type="submit"
                    className={cx(
                        'btn-primary btn w-1/2',
                        isLoading ? 'btn-disabled loading' : null
                    )}
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
                <button
                    type="button"
                    className="btn-error btn w-1/2"
                    onClick={() => setCreating(false)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateColumnForm;
