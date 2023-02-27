import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnTitle, columnTitleSchema } from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { BoardColumn } from '@prisma/client';
import { cx } from 'class-variance-authority';
import React from 'react';
import { useForm } from 'react-hook-form';
import { HiPencil } from 'react-icons/hi';
import useKanbanStore from 'store/kanban-store';

interface EditTitleInputProps {
    column: BoardColumn;
    toggleEdit: () => void;
}
const EditTitleInput = ({ column, toggleEdit }: EditTitleInputProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ColumnTitle>({
        resolver: zodResolver(columnTitleSchema),
        defaultValues: { title: column.title },
    });

    const updateStoreCol = useKanbanStore((state) => state.updateColumn);
    const {
        mutate: updateColumn,
        isLoading,
        error: updateErr,
    } = trpc.boardColumnRouter.update.useMutation({
        onSuccess: ({ title }) => {
            updateStoreCol({ ...column, title });
            toggleEdit();
        },
    });

    const onSubmit = handleSubmit(({ title }) => {
        if (title === column.title) {
            toggleEdit();
            return;
        }
        updateColumn({ id: column.id, title });
    });

    return (
        <form className="form-control mb-4 w-full" onSubmit={onSubmit}>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Column title…"
                    className={cx(
                        'input-bordered input w-full',
                        errors.title && 'input-error',
                        isLoading ? 'disabled' : null
                    )}
                    {...register('title', { required: true })}
                    autoFocus
                />
                <button
                    type="submit"
                    className={cx(
                        'btn-square btn',
                        isLoading ? 'btn-disabled loading' : null
                    )}
                    aria-label={`Update ${column.title} column with a new title`}
                >
                    {!isLoading && <HiPencil size={18} />}
                </button>
            </div>
            {errors.title && (
                <p className="mt-2 text-sm text-error">
                    {errors.title.message}
                </p>
            )}
        </form>
    );
};

export default EditTitleInput;
