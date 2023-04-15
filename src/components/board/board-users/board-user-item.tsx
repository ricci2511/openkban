import { BoardUserAvatar } from '@components/board-user-avatar';
import { BoardUserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ClientBoardUser } from 'types/board-types';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectGroup,
} from '@components/ui/select';
import { useIsAdminUser } from 'store/kanban-store';
import { RxTrash } from 'react-icons/rx';

const boardUserRoles = Object.values(BoardUserRole);

export const BoardUserItem = ({
    boardUser,
}: {
    boardUser: ClientBoardUser;
}) => {
    const { role, user, userId } = boardUser;
    const me = useSession().data!.user!;
    const isAdmin = useIsAdminUser();

    return (
        <li className="group rounded-md p-2 transition-all duration-200 hover:bg-base-300">
            <div className="flex items-center gap-3">
                <BoardUserAvatar boardUser={boardUser} width={36} height={36} />
                <div className="flex flex-col gap-1">
                    <span>
                        {user.name} {userId === me.id && '(you)'}
                    </span>
                    <span className="text text-xs font-light">
                        {user.email}
                    </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select defaultValue={role}>
                        <SelectTrigger
                            className={`min-w-[8rem] ${
                                userId === me.id && 'mr-9'
                            }`}
                        >
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {boardUserRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {isAdmin && userId !== me.id && (
                        <button className="btn-error btn-sm btn px-1.5">
                            <RxTrash size={16} />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};
