import DotsDropdownButton from '@components/ui/buttons/dots-dropdown-button';
import useDeleteBoard from '@hooks/use-delete-board';
import useUpdateBoard from '@hooks/use-update-board';
import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import { HiPencil, HiTrash, HiOutlineStar } from 'react-icons/hi';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const { deleteBoard } = useDeleteBoard();
    const { updateBoard } = useUpdateBoard();

    const { id, title, isFavourite } = board;
    const [editTitle, setEditTitle] = useState(title);
    const [favourite, setFavourite] = useState(isFavourite);
    const [editMode, setEditMode] = useState(false);

    const handleEditMode = () => setEditMode((edit) => !edit);
    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEditMode();
            if (editTitle === title) return;
            updateBoard({ id: id, title: editTitle });
        }
    };

    const handleFavouriteClick = () => {
        setFavourite((favourite) => !favourite);
        updateBoard({ id: id, isFavourite: !favourite });
    };

    return (
        <li
            key={id}
            className="relative flex min-h-[85px] items-center justify-between gap-4 rounded-sm bg-base-300 py-3 pl-3 pr-1"
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
                    onKeyDown={(e) => handleEditKeyDown(e)}
                    onBlur={handleEditMode}
                    autoFocus
                />
            ) : (
                <p className="text-base">{title}</p>
            )}
            <div
                className={`${
                    favourite ? 'tooltip-error' : 'tooltip-primary'
                } tooltip tooltip-right absolute -top-3 -left-4`}
                data-tip={
                    favourite ? 'Remove from favourites' : 'Add to favourites'
                }
            >
                <button
                    type="button"
                    aria-describedby="Click this to add the selected board to your favourites"
                    className="btn-ghost btn-xs btn"
                    onClick={handleFavouriteClick}
                >
                    <HiOutlineStar
                        fill={favourite ? '#FFD100' : 'white'}
                        stroke="black"
                        strokeWidth={1}
                        size={15}
                    />
                </button>
            </div>
            <DotsDropdownButton>
                <li>
                    <button
                        type="button"
                        aria-describedby="Click this to edit the selected board title"
                        className="btn-outline btn-md font-medium"
                        onClick={handleEditMode}
                    >
                        <HiPencil size={18} />
                        Rename
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
