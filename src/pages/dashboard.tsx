import MainLayout from '@components/layouts/main-layout';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import DotsDropdownButton from '@components/ui/buttons/dots-dropdown-button';
import BoardItem from '@components/board';
import useCreateBoard from '@hooks/use-create-board';

const Dashboard = () => {
    const { data: session } = useSession();
    const { data: boards, isLoading } = trpc.boardRouter.getAll.useQuery();
    const { createBoard, error } = useCreateBoard();
    const [boardTitle, setBoardTitle] = useState('');

    const boardItems =
        boards &&
        boards
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .map((board) => <BoardItem key={board.id} board={board} />);

    return (
        <MainLayout>
            <>
                <h1 className="mb-4 text-xl font-semibold">
                    {session && session.user
                        ? `${session.user.name}'s`
                        : `Your`}{' '}
                    dashboard
                </h1>
                {isLoading && <CustomLoadingSpinner />}
                {boardItems && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                        {boardItems}
                    </ul>
                )}
                <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input w-full"
                    onChange={(e) => setBoardTitle(e.currentTarget.value)}
                />
                <button
                    className="btn-primary btn mt-4"
                    onClick={() => {
                        createBoard({ title: boardTitle });
                    }}
                >
                    Create Board
                </button>
            </>
        </MainLayout>
    );
};

Dashboard.auth = true;
export default Dashboard;
