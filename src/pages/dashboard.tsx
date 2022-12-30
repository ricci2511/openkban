import React from 'react';
import { useSession } from 'next-auth/react';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import BoardItem from '@components/dashboard/board-item';
import DashboardLayout from '@components/layouts/dashboard-layout';
import useGetBoards from '@hooks/use-get-boards';

const Dashboard = () => {
    const { data: session } = useSession();
    const { boards, isLoading } = useGetBoards({
        prop: 'createdAt',
        desc: true,
    });

    const boardItems =
        boards &&
        boards.map((board) => <BoardItem key={board.id} board={board} />);

    return (
        <DashboardLayout>
            <>
                <h1 className="mb-8 text-xl font-semibold">
                    {session && session.user
                        ? `${session.user.name}'s`
                        : `Your`}{' '}
                    dashboard
                </h1>
                {isLoading && <CustomLoadingSpinner />}
                {boardItems && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {boardItems}
                    </ul>
                )}
            </>
        </DashboardLayout>
    );
};

export default Dashboard;
