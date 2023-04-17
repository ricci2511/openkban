import { cn } from '@lib/helpers';
import { User } from '@prisma/client';
import Image from 'next/image';

interface UserSearchResultsProps {
    users: User[];
    handleUserSelect: (user: User) => void;
    currentBoardUserIds: string[];
    invitedUserIds: string[];
}

export const UserSearchResults = ({
    users,
    handleUserSelect,
    currentBoardUserIds,
    invitedUserIds,
}: UserSearchResultsProps) => {
    return (
        <ul className="space-y-3">
            {users.map(({ id, name, image, email, ...rest }) => (
                <li
                    key={id}
                    className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-md p-1 transition-all duration-200 hover:bg-base-300',
                        // disable selection if user is already a member or invited
                        (currentBoardUserIds.includes(id) ||
                            invitedUserIds.includes(id)) &&
                            'cursor-not-allowed opacity-50'
                    )}
                    onClick={() =>
                        handleUserSelect({ id, name, image, email, ...rest })
                    }
                >
                    <Image
                        src={image ?? ''}
                        alt={name ?? email ?? 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col gap-0.5">
                        <span className="break-word text-sm sm:text-base">
                            {name}
                        </span>
                        <span className="break-word text-xs font-light">
                            {email}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};
