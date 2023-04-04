import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import MainLayout from '@components/layouts/main-layout';
import { NextPageWithLayout } from 'pages/_app';
import useUpdateBoard from '@hooks/use-update-board';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import KanbanBodySection from '@components/board/kanban-body-section';
import KanbanHeaderSection from '@components/board/kanban-header-section';
import { trpc } from '@lib/trpc';
import { useBoardId, useInitKanbanStore } from 'store/kanban-store';

export const BoardPage: NextPageWithLayout = () => {
    const id = useRouter().query.boardId as string;

    const initStore = useInitKanbanStore();
    const { mutate: updateBoard } = useUpdateBoard();
    const storeBoardId = useBoardId();

    const { data, error, isLoading } = trpc.boardRouter.getById.useQuery(
        {
            id,
        },
        {
            refetchOnWindowFocus: false,
            onSuccess: ({ id, columns }) => {
                initStore(columns);
                // update lastInteractedAt only if a different board is loaded
                if (id !== storeBoardId) {
                    updateBoard({ id, lastInteractedAt: new Date() });
                }
            },
        }
    );

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
            <KanbanBodySection />
        </>
    );
};

BoardPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout className="h-full">{page}</MainLayout>;
};

export default BoardPage;
