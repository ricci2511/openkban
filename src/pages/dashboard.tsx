import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { CreateBoardModal } from '@components/dashboard/create-board-modal';
import { BoardCard } from '@components/dashboard/board-card';
import { MainLayout } from '@components/layouts/main-layout';
import { useGetBoards } from '@hooks/use-get-boards';

const Dashboard = () => {
    const { data: session } = useSession();
    const { boards, isLoading } = useGetBoards({
        prop: 'createdAt',
        order: 'desc',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MainLayout responsive>
            <>
                <h1 className="mb-12 text-xl font-semibold">
                    {session && session.user
                        ? `${session.user.name}'s`
                        : `Your`}{' '}
                    dashboard
                </h1>
                {isLoading && <LoadingSpinner />}
                {boards && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {boards.map((board) => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </ul>
                )}
                {!isLoading && (
                    <>
                        <button
                            className="btn-primary btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Board
                        </button>
                        <CreateBoardModal
                            open={isModalOpen}
                            closeModal={() => setIsModalOpen(false)}
                        />
                    </>
                )}
            </>
        </MainLayout>
    );
};

export default Dashboard;
