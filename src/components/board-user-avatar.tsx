import { ClientBoardUser } from 'types/board-types';
import React from 'react';
import Image from 'next/image';

interface BoardUserAvatarProps {
    boardUser: ClientBoardUser;
    width?: number;
    height?: number;
}

export const BoardUserAvatar = ({
    boardUser,
    width = 32,
    height = 32,
}: BoardUserAvatarProps) => {
    const { email, image, name } = boardUser.user;
    const isAdmin = boardUser.role === 'ADMIN';
    const userName = name ?? email ?? (isAdmin ? 'Admin' : 'User');

    return (
        <Image
            src={image ?? ''}
            alt={userName}
            title={`${userName} ${isAdmin ? '[admin]' : ''}`}
            width={width}
            height={height}
            className="rounded-full"
        />
    );
};
