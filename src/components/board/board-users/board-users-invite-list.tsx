import { Badge } from '@components/ui/badge';
import { User } from '@prisma/client';
import { X } from 'lucide-react';

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
                <Badge key={id}>
                    <span>{name}</span>
                    <button>
                        <X
                            className="ml-2 h-3 w-3"
                            onClick={() => deleteInvitedUser(id)}
                        />
                        <span className="sr-only">
                            Remove {name} from invite list
                        </span>
                    </button>
                </Badge>
            ))}
        </div>
    );
};
