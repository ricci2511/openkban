import DotsDropdownButton from '@components/ui/buttons/dots-dropdown-button';
import useDeleteBoard from '@hooks/use-delete-board';
import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const { deleteBoard } = useDeleteBoard();
    const { updateBoard } = useUpdateBoard();

    const { id, title, isFavourite } = board;
    const [editTitle, setEditTitle] = useState(title);
    const [editMode, setEditMode] = useState(false);

    const handleEditMode = () => setEditMode((prevState) => !prevState);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEditMode();
            if (editTitle === title) return;
            updateBoard({ title: editTitle, id: id });
        }
    };

    return (
        <li
            key={id}
            className="flex h-20 items-center justify-between gap-2 rounded-sm bg-base-300 py-3 pl-3 pr-1"
        >
            {editMode ? (
                <input
                    type="text"
                    name="board-title"
                    title="Board Title"
                    aria-label="Edit title"
                    className="input w-full max-w-xs"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.currentTarget.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onBlur={handleEditMode}
                    autoFocus
                />
            ) : (
                <p className="text-base">{title}</p>
            )}
            <DotsDropdownButton>
                <li>
                    <button
                        type="button"
                        aria-describedby="Click this to edit the selected board title"
                        className="btn-outline btn-md font-medium"
                        onClick={handleEditMode}
                    >
                        <HiPencil size={18} />
                        Edit
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        aria-describedby="Click this to delete the selected board"
                        className="btn-outline btn-error btn-md font-medium"
                        onClick={() => deleteBoard({ id: id })}
                    >
                        <HiTrash size={18} />
                        Delete
                    </button>
                </li>
            </DotsDropdownButton>
        </li>
    );
};

export default BoardItem;
