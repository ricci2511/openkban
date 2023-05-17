import { LoadingSpinner } from '@components/ui/loading-spinner';
import { BoardCard } from './board-card';
import { useGetBoards } from '@hooks/use-get-boards';
import { useSession } from 'next-auth/react';
import { CreateBoardDialogButton } from './create-board-dialog-button';

export const Dashboard = () => {
    const { data: session } = useSession();
    const { boards, isLoading } = useGetBoards({
        prop: 'createdAt',
        order: 'desc',
    });

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="mb-8 text-xl font-semibold">
                {session && session.user ? `${session.user.name}'s` : `Your`}{' '}
                dashboard
            </h1>
            <div className="space-y-6">
                <CreateBoardDialogButton />
                {isLoading && <LoadingSpinner />}
                {boards && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {boards.map((board) => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
