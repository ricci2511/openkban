import { BoardWithUsersRoles } from 'types/board-types';
import React from 'react';
import Image from 'next/image';

const AdminAvatar = ({
    admin,
}: {
    admin: BoardWithUsersRoles['boardUser'][0];
}) => {
    const { email, image, name } = admin.user;

    return (
        <Image
            src={image ?? ''}
            alt={name ?? email ?? 'Admin'}
            width={32}
            height={32}
            className="rounded-full"
        />
    );
};

export default AdminAvatar;
