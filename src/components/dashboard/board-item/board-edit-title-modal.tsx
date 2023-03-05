import EditTitleModal from '@components/ui/form/edit-title-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import useUpdateBoard from '@hooks/use-update-board';
import {
    TitleInput,
    boardTitle,
    titleSchema,
} from '@lib/schemas/board-schemas';
import { Board } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BoardEditTitleModalProps {
    board: Board;
    isEditting: boolean;
    toggleEditting: () => void;
}

const BoardEditTitleModal = ({
    board,
    isEditting,
    toggleEditting,
}: BoardEditTitleModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(boardTitle)),
    });

    const { updateBoard, isLoading } = useUpdateBoard(toggleEditting);
    const onSubmit = handleSubmit(({ title }) => {
        if (title === board.title) {
            toggleEditting();
            return;
        }
        updateBoard({ id: board.id, title });
    });

    return (
        <EditTitleModal
            open={isEditting}
            closeDialog={toggleEditting}
            name="board"
            formRegister={register}
            errors={errors}
            onSubmit={onSubmit}
            isLoading={isLoading}
            oldTitle={board.title}
        />
    );
};

export default BoardEditTitleModal;
