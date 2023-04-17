import { User } from '@prisma/client';
import { RxCross1 } from 'react-icons/rx';

interface BoardUsersInviteListProps {
    users: User[];
    deleteInvitedUser: (id: string) => void;
}

export const BoardUsersInviteList = ({
    users,
    deleteInvitedUser,
}: BoardUsersInviteListProps) => {
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {users.map(({ id, name }) => (
                <div key={id} className="badge py-3">
                    <span className="text-xs">{name}</span>
                    <button>
                        <RxCross1
                            className="ml-2 h-3 w-3"
                            onClick={() => deleteInvitedUser(id)}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
};
