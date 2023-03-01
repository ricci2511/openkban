import useDeleteBoard from '@hooks/use-delete-board';
import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import FavouriteButton from './favourite-button';
import OptionsDropdown from './options-dropdown';
import { HiPencil } from 'react-icons/hi';
import Link from 'next/link';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const { id, title, isFavourite } = board;
    const [editTitle, setEditTitle] = useState(title);
    const [favourite, setFavourite] = useState(isFavourite);
    const [editMode, setEditMode] = useState(false);

    const { deleteBoard } = useDeleteBoard();
    const { updateBoard } = useUpdateBoard();

    const deleteItem = () => deleteBoard({ id: id });
    const handleEditMode = () => setEditMode((edit) => !edit);

    const updateTitle = () => {
        handleEditMode();
        if (editTitle === title) return;
        updateBoard({ id: id, title: editTitle });
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') updateTitle();
    };

    const handleFavouriteClick = () => {
        setFavourite((favourite) => !favourite);
        updateBoard({ id: id, isFavourite: !favourite });
    };

    return (
        <li
            key={id}
            className="relative flex min-h-[85px] items-center justify-between gap-2 rounded-sm bg-base-300 py-3 pl-3 pr-1"
        >
            {editMode ? (
                <div className="input-group flex-1">
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
                    <button
                        className="btn-square btn"
                        title="Submit edit"
                        onClick={updateTitle}
                    >
                        <HiPencil />
                    </button>
                </div>
            ) : (
                <Link
                    href={`/board/${id}`}
                    className="flex-1 cursor-pointer break-all text-base"
                >
                    {title}
                </Link>
            )}
            <FavouriteButton
                favourite={favourite}
                handleFavouriteClick={handleFavouriteClick}
            />
            {!editMode && (
                <OptionsDropdown
                    boardTitle={title}
                    handleEditMode={handleEditMode}
                    deleteItem={deleteItem}
                />
            )}
        </li>
    );
};

export default BoardItem;
