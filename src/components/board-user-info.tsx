import { ClientBoardUser } from 'types/board-types';
import { BoardUserAvatar } from './board-user-avatar';

interface BoardUserInfoProps {
    boardUser: ClientBoardUser;
    isMe?: boolean;
    avatarWidth?: number;
    avatarHeight?: number;
}

export const BoardUserInfo = ({
    boardUser,
    isMe,
    avatarWidth,
    avatarHeight,
}: BoardUserInfoProps) => {
    return (
        <div className="flex items-center gap-3">
            <BoardUserAvatar
                boardUser={boardUser}
                width={avatarWidth}
                height={avatarHeight}
            />
            <div className="flex flex-col gap-1">
                <span className="break-word text-sm">
                    {boardUser.user.name} {isMe && '(you)'}
                </span>
                <span className="break-word text-xs font-light">
                    {boardUser.user.email}
                </span>
            </div>
        </div>
    );
};
