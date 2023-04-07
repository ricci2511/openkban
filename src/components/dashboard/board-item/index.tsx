import useUpdateBoard from '@hooks/use-update-board';
import React from 'react';
import FavouriteButton from './favourite-button';
import BoardOptionsDropdown from './board-options-dropdown';
import Link from 'next/link';
import { BoardWithUsersRoles } from 'types/board-types';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface BoardProps {
    board: BoardWithUsersRoles;
}

const BoardItem = ({ board }: BoardProps) => {
    const { id, title, isFavourite, boardUser } = board;

    const { mutate: updateBoard } = useUpdateBoard();
    const updateFavourite = () => {
        updateBoard({ id: board.id, isFavourite: !isFavourite });
    };

    // TEMPORARY TESTING
    const { data: session } = useSession();
    const owner = boardUser.find((user) => user.role === 'ADMIN');
    const isOwner = owner?.user.email === session!.user!.email;
    const { email, image, name } = owner!.user;

    return (
        <li
            key={id}
            className="relative mb-4 flex min-h-[85px] items-center justify-between gap-2 rounded-sm bg-base-300 py-3 pl-3 pr-1"
        >
            <Link
                href={`/board/${id}`}
                className="flex-1 cursor-pointer break-all text-base"
            >
                {title}
            </Link>
            {owner && !isOwner && (
                <div className="absolute -bottom-5 -left-3">
                    <Image
                        src={image!}
                        alt={name!}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </div>
            )}

            <FavouriteButton
                favourite={isFavourite}
                updateFavourite={updateFavourite}
            />
            <BoardOptionsDropdown board={board} />
        </li>
    );
};

export default BoardItem;
