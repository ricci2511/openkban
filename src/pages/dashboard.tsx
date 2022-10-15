import MainLayout from '@components/layouts/main-layout';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import CenteredLoadingSpinner from '@components/UI/other/centered-loading-spinner';

const Dashboard = () => {
    const { data: session } = useSession();
    const {
        data: boards,
        isLoading,
        refetch,
    } = trpc.boardRouter.getAll.useQuery();
    const { mutate: createBoard } = trpc.boardRouter.create.useMutation({
        onSuccess: () => refetch(),
    });

    // Testing purposes
    const [boardTitle, setBoardTitle] = useState('');

    return (
        <MainLayout>
            <>
                <h1 className="mb-4 text-xl font-semibold">
                    {session && session.user
                        ? `${session.user.name}'s`
                        : `Your`}{' '}
                    dashboard
                </h1>
                {isLoading && <CenteredLoadingSpinner />}
                {boards && (
                    <ul className="mb-4 flex gap-3">
                        {boards.map((board) => (
                            <li
                                key={board.id}
                                className="rounded-sm bg-base-300 p-3"
                            >
                                <p className="text-base">{board.title}</p>
                            </li>
                        ))}
                    </ul>
                )}
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered mr-4 w-full max-w-xs"
                    onChange={(e) => setBoardTitle(e.currentTarget.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={async () => {
                        createBoard({ title: boardTitle });
                    }}
                >
                    Create Random Board
                </button>
            </>
        </MainLayout>
    );
};

Dashboard.auth = true;
export default Dashboard;
