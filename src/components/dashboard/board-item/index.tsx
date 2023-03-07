import useDeleteBoard from '@hooks/use-delete-board';
import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import FavouriteButton from './favourite-button';
import BoardOptionsDropdown from './board-options-dropdown';
import Link from 'next/link';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const { id, title, isFavourite } = board;

    const { deleteBoard } = useDeleteBoard();
    const removeBoard = () => deleteBoard({ id });

    const { mutate: updateBoard } = useUpdateBoard();
    const [favourite, setFavourite] = useState(isFavourite);
    const updateFavourite = () => {
        setFavourite((favourite) => !favourite);
        updateBoard({ id: board.id, isFavourite: !favourite });
    };

    return (
        <li
            key={id}
            className="relative flex min-h-[85px] items-center justify-between gap-2 rounded-sm bg-base-300 py-3 pl-3 pr-1"
        >
            <Link
                href={`/board/${id}`}
                className="flex-1 cursor-pointer break-all text-base"
            >
                {title}
            </Link>
            <FavouriteButton
                favourite={favourite}
                updateFavourite={updateFavourite}
            />
            <BoardOptionsDropdown board={board} removeBoard={removeBoard} />
        </li>
    );
};

export default BoardItem;
