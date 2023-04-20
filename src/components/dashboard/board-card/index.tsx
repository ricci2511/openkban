import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BoardWithUsers } from 'types/board-types';
import { useUpdateBoardUser } from '@hooks/mutations/use-board-user-mutations';
import { FavouriteButton } from './favourite-button';
import { BoardOptionsDropdown } from './board-options-dropdown';
import { BoardUserAvatar } from '@components/board-user-avatar';

interface BoardProps {
    board: BoardWithUsers;
}

export const BoardCard = ({ board }: BoardProps) => {
    const { id, title, boardUser } = board;

    const { data: session } = useSession();

    const me = boardUser.find((bu) => bu.userId === session!.user!.id)!;
    const { isFavourite, role, userId } = me;
    const isAdmin = role === 'ADMIN';

    // fav status is stored on the boardUser, each user can have its own fav status for the same board
    const { mutate: updateBoardUser } = useUpdateBoardUser();
    const updateFavourite = () => {
        updateBoardUser({ boardId: id, isFavourite: !isFavourite, userId });
    };

    const admin = isAdmin ? me : boardUser.find((bu) => bu.role === 'ADMIN');

    return (
        <li
            key={id}
            className="relative mb-4 flex min-h-[85px] items-center justify-between gap-2 rounded-sm bg-muted py-3 pl-3 pr-1"
        >
            <Link
                href={`/board/${id}`}
                className="flex-1 cursor-pointer break-all text-base"
            >
                {title}
            </Link>
            {/* Display the admin's avatar for boards that the user is not an admin of */}
            {admin && !isAdmin && (
                <div className="absolute -bottom-5 -left-3">
                    <BoardUserAvatar boardUser={admin} />
                </div>
            )}
            <div className="absolute -top-4 -left-3">
                <FavouriteButton
                    favourite={isFavourite}
                    updateFavourite={updateFavourite}
                />
            </div>
            <BoardOptionsDropdown board={board} isAdmin={isAdmin} />
        </li>
    );
};
