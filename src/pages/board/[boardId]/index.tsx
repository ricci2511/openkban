import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import MainLayout from '@components/layouts/main-layout';
import { NextPageWithLayout } from 'pages/_app';
import useUpdateBoard from '@hooks/use-update-board';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import KanbanBodySection from '@components/board/kanban-body-section';
import KanbanHeaderSection from '@components/board/kanban-header-section';
import { trpc } from '@lib/trpc';
import { useBoardId } from 'store/kanban-store';

export const BoardPage: NextPageWithLayout = () => {
    const id = useRouter().query.boardId as string;
    const { data, error, isLoading } = trpc.boardRouter.getById.useQuery({
        id,
    });

    const { mutate: updateBoard } = useUpdateBoard();
    const storeBoardId = useBoardId();

    useEffect(() => {
        if (data && storeBoardId !== id) {
            updateBoard({ id, lastInteractedAt: new Date() });
        }
    }, [id, updateBoard, data, storeBoardId]);

    if (error) {
        return (
            <NextError
                title={error.message}
                statusCode={error.data?.httpStatus ?? 500}
            />
        );
    }

    if (isLoading) {
        return <CustomLoadingSpinner centered />;
    }

    if (!data) {
        return <NextError title="Board not found" statusCode={404} />;
    }

    return (
        <>
            <KanbanHeaderSection title={data.title} />
            <KanbanBodySection columns={data.columns} />
        </>
    );
};

BoardPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout className="h-full">{page}</MainLayout>;
};

export default BoardPage;
