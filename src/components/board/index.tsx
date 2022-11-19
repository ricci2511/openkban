import useDeleteBoard from '@hooks/use-delete-board';
import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import FavouriteButton from './favourite-button';
import OptionsDropdown from './options-dropdown';

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
    const updateTitle = () => updateBoard({ id: id, title: editTitle });
    const updateFavourite = () =>
        updateBoard({ id: id, isFavourite: !favourite });

    const handleEditMode = () => setEditMode((edit) => !edit);
    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEditMode();
            if (editTitle === title) return;
            updateTitle();
        }
    };

    const handleFavouriteClick = () => {
        setFavourite((favourite) => !favourite);
        updateFavourite();
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
            <FavouriteButton
                favourite={favourite}
                handleFavouriteClick={handleFavouriteClick}
            />
            <OptionsDropdown
                handleEditMode={handleEditMode}
                deleteItem={deleteItem}
            />
        </li>
    );
};

export default BoardItem;
