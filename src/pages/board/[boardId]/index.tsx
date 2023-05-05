import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { LoadingSpinner } from '@components/ui/loading-spinner';
import { trpc } from '@lib/trpc';
import { useUpdateBoard } from '@hooks/mutations/use-board-mutations';
import { KanbanHeaderSection } from '@components/board/kanban-header-section';
import { KanbanBodySection } from '@components/board/kanban-body-section';
import { useSession } from 'next-auth/react';
import { KanbanLayout } from '@components/layouts/kanban-layout';
import { getBoardId, initKanbanStore } from 'store/kanban-store';

const BoardPage: NextPageWithLayout = () => {
    const id = useRouter().query.boardId as string;

    const { mutate: updateBoard } = useUpdateBoard();
    const { data: session } = useSession();

    const { data, error, isLoading } = trpc.boardRouter.getById.useQuery(
        {
            id,
        },
        {
            refetchOnWindowFocus: false,
            onSuccess: (board) => {
                const role = board.boardUsers.find(
                    (bu) => bu.user.id === session?.user?.id
                )?.role;
                initKanbanStore(board, role!);
                // update lastInteractedAt only if a different board is loaded
                if (id !== getBoardId()) {
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
    return <KanbanLayout>{page}</KanbanLayout>;
};

export default BoardPage;
