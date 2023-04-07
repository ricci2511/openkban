import React from 'react';
import { useSession } from 'next-auth/react';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import BoardItem from '@components/dashboard/board-item';
import useGetBoards from '@hooks/use-get-boards';
import MainLayout from '@components/layouts/main-layout';
import CreateBoardModalButton from '@components/dashboard/create-board-modal-button';

const Dashboard = () => {
    const { data: session } = useSession();
    const { boards, isLoading } = useGetBoards({
        prop: 'createdAt',
        order: 'desc',
    });

    return (
        <MainLayout responsive>
            <>
                <h1 className="mb-12 text-xl font-semibold">
                    {session && session.user
                        ? `${session.user.name}'s`
                        : `Your`}{' '}
                    dashboard
                </h1>
                {isLoading && <CustomLoadingSpinner />}
                {boards && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {boards.map((board) => (
                            <BoardItem key={board.id} board={board} />
                        ))}
                    </ul>
                )}
                <CreateBoardModalButton />
            </>
        </MainLayout>
    );
};

export default Dashboard;
