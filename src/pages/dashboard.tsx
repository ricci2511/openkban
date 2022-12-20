import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import BoardItem from '@components/board';
import DashboardLayout from '@components/layouts/dashboard-layout';

const Dashboard = () => {
    const { data: session } = useSession();
    const { data: boards, isLoading } = trpc.boardRouter.getAll.useQuery();

    const boardItems =
        boards &&
        boards
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .map((board) => <BoardItem key={board.id} board={board} />);

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
