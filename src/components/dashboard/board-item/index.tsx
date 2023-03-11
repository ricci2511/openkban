import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React from 'react';
import FavouriteButton from './favourite-button';
import BoardOptionsDropdown from './board-options-dropdown';
import Link from 'next/link';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const { id, title, isFavourite } = board;

    const { mutate: updateBoard } = useUpdateBoard();
    const updateFavourite = () => {
        updateBoard({ id: board.id, isFavourite: !isFavourite });
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
                favourite={isFavourite}
                updateFavourite={updateFavourite}
            />
            <BoardOptionsDropdown board={board} />
        </li>
    );
};

export default BoardItem;
