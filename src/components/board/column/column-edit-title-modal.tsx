import EditTitleModal from '@components/ui/form/edit-title-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TitleInput,
    columnTitle,
    titleSchema,
} from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { BoardColumn } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import useKanbanStore from 'store/kanban-store';

interface ColumnEditTitleModalProps {
    column: BoardColumn;
    isEditting: boolean;
    toggleEditting: () => void;
}

const ColumnEditTitleModal = ({
    column,
    isEditting,
    toggleEditting,
}: ColumnEditTitleModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(columnTitle)),
    });

    const updateStoreCol = useKanbanStore((state) => state.updateColumn);
    const { mutate: updateColumn, isLoading } =
        trpc.boardColumnRouter.update.useMutation({
            onSuccess: ({ title }) => {
                updateStoreCol({ ...column, title });
                toggleEditting();
            },
        });

    const onSubmit = handleSubmit(({ title }) => {
        if (title === column.title) {
            toggleEditting();
            return;
        }
        updateColumn({ id: column.id, title });
    });

    return (
        <EditTitleModal
            open={isEditting}
            closeDialog={toggleEditting}
            name="column"
            formRegister={register}
            errors={errors}
            onSubmit={onSubmit}
            isLoading={isLoading}
            oldTitle={column.title}
        />
    );
};

export default ColumnEditTitleModal;
