import MainLayout from '@components/layouts/main-layout';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/UI/other/custom-loading-spinner';
import DotsDropdownButton from '@components/UI/buttons/dots-dropdown-button';
import BoardItem from '@components/board';

const Dashboard = () => {
    const utils = trpc.useContext();
    const { data: session } = useSession();
    const { data: boards, isLoading } = trpc.boardRouter.getAll.useQuery();
    const { mutate: createBoard, error } = trpc.boardRouter.create.useMutation({
        onSuccess: (data) => {
            const newBoards = [...(boards || [])].concat(data);
            utils.boardRouter.getAll.setData(newBoards);
        },
    });

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
                            <BoardItem key={board.id} board={board} />
                        ))}
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
