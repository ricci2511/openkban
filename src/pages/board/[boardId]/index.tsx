import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { trpc } from '@lib/trpc';
import { useBoardId, useInitKanbanStore } from 'store/kanban-store';
import { useUpdateBoard } from '@hooks/mutations/use-board-mutations';
import { MainLayout } from '@components/layouts/main-layout';
import { KanbanHeaderSection } from '@components/board/kanban-header-section';
import { KanbanBodySection } from '@components/board/kanban-body-section';
import { useSession } from 'next-auth/react';

const BoardPage: NextPageWithLayout = () => {
    const id = useRouter().query.boardId as string;

    const initStore = useInitKanbanStore();
    const { mutate: updateBoard } = useUpdateBoard();
    const storeBoardId = useBoardId();
    const { data: session } = useSession();

    const { data, error, isLoading } = trpc.boardRouter.getById.useQuery(
        {
            id,
        },
        {
            refetchOnWindowFocus: false,
            onSuccess: ({ id, columns, tasks, boardUser }) => {
                const role = boardUser.find(
                    (bu) => bu.userId === session?.user?.id
                )?.role;
                initStore(columns, tasks, boardUser, role!);
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
        return <LoadingSpinner centered />;
    }

    if (!data) {
        return <NextError title="Board not found" statusCode={404} />;
    }

    // TODO: SEO
    return (
        <>
            <KanbanHeaderSection title={data.title} />
            <KanbanBodySection />
        </>
    );
};

BoardPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout className="relative h-full overflow-y-auto">
            <div className="absolute inset-0 overflow-hidden">
                <div className="relative mr-0 flex h-full flex-col">{page}</div>
            </div>
        </MainLayout>
    );
};

export default BoardPage;
