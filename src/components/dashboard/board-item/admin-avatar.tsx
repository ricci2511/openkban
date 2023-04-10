import { ClientBoardUser } from 'types/board-types';
import React from 'react';
import Image from 'next/image';
import { Tooltip } from 'react-daisyui';

const AdminAvatar = ({ admin }: { admin: ClientBoardUser }) => {
    const { email, image, name } = admin.user;
    const adminName = name ?? email ?? 'Admin';

    return (
        <Tooltip message={`${adminName} (admin)`} position="bottom">
            <Image
                src={image ?? ''}
                alt={name ?? email ?? 'Admin'}
                width={32}
                height={32}
                className="rounded-full"
            />
        </Tooltip>
    );
};

export default AdminAvatar;
