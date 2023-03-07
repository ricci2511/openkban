import NextError from 'next/error';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import MainLayout from '@components/layouts/main-layout';
import { NextPageWithLayout } from 'pages/_app';
import useUpdateBoard from '@hooks/use-update-board';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import KanbanBoard from '@components/board';

export const BoardPage: NextPageWithLayout = () => {
    const id = useRouter().query.boardId as string;
    const { data, error, status } = trpc.boardRouter.getById.useQuery(
        { id },
        { cacheTime: 0 }
    );
    const { mutate: updateBoard } = useUpdateBoard();

    // Update the board's lastInteractedAt field
    useEffect(() => {
        if (id) {
            updateBoard({ id, lastInteractedAt: new Date() });
        }
    }, [id, updateBoard]);

    if (error) {
        return (
            <NextError
                title={error.message}
                statusCode={error.data?.httpStatus ?? 500}
            />
        );
    }

    if (status !== 'success') {
        return <CustomLoadingSpinner centered />;
    }

    if (!data) {
        return <NextError title="Board not found" statusCode={404} />;
    }

    return <KanbanBoard boardData={data} />;
};

BoardPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout className="h-full">{page}</MainLayout>;
};

export default BoardPage;
