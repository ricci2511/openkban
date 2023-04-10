import React from 'react';
import FavouriteButton from './favourite-button';
import BoardOptionsDropdown from './board-options-dropdown';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useUpdateBoardUser from '@hooks/use-update-board-user';
import AdminAvatar from './admin-avatar';
import { BoardWithUsers } from 'types/board-types';

interface BoardProps {
    board: BoardWithUsers;
}

const BoardItem = ({ board }: BoardProps) => {
    const { id, title, boardUser } = board;

    const { data: session } = useSession();

    const me = boardUser.find((bu) => bu.userId === session!.user!.id)!;
    const { isFavourite, role, userId } = me;

    // fav status is stored on the boardUser, each user can have its own fav status for the same board
    const { mutate: updateBoardUser } = useUpdateBoardUser(userId);
    const updateFavourite = () => {
        updateBoardUser({ boardId: id, isFavourite: !isFavourite });
    };

    const admin = boardUser.find((bu) => bu.role === 'ADMIN');

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
            {/* Display the admin's avatar for boards that the user is not an admin of */}
            {admin && role !== 'ADMIN' && (
                <div className="absolute -bottom-5 -left-3">
                    <AdminAvatar admin={admin} />
                </div>
            )}
            <div className="absolute -top-3 -left-4">
                <FavouriteButton
                    favourite={isFavourite}
                    updateFavourite={updateFavourite}
                />
            </div>
            <BoardOptionsDropdown board={board} isAdmin={role === 'ADMIN'} />
        </li>
    );
};

export default BoardItem;
