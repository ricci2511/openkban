import MainLayout from '@components/layouts/main-layout';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/UI/other/custom-loading-spinner';

const Dashboard = () => {
    const { data: session } = useSession();
    const utils = trpc.useContext();
    const { data: boards, isLoading } = trpc.boardRouter.getAll.useQuery();
    const { mutate: createBoard } = trpc.boardRouter.create.useMutation({
        onSuccess: () => utils.boardRouter.getAll.invalidate(),
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
                {isLoading && <CustomLoadingSpinner />}
                {boards && (
                    <ul className="mb-4 grid grid-flow-row grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
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
                    className="input input-bordered w-full"
                    onChange={(e) => setBoardTitle(e.currentTarget.value)}
                />
                <button
                    className="btn btn-primary mt-4"
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
