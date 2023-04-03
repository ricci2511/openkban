import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import TaskDetails from '@components/task-details';
import { NextPageWithLayout } from 'pages/_app';
import MainLayout from '@components/layouts/main-layout';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';

export const TaskPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { boardId, taskId } = router.query;
    const {
        data: task,
        error,
        status,
    } = trpc.boardTaskRouter.getById.useQuery({ id: taskId as string });

    const { data: columns } = trpc.boardColumnRouter.getAll.useQuery({
        boardId: boardId as string,
    });

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

    if (!task) {
        return <NextError title="Task not found" statusCode={404} />;
    }

    return (
        <div>
            <button
                className="mb-4"
                onClick={() =>
                    router.push(`/board/${boardId}`, undefined, {
                        shallow: true,
                    })
                }
            >
                {'<- BACK TO BOARD'}
            </button>
            <TaskDetails task={task} columns={columns} />
        </div>
    );
};

TaskPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout responsive>{page}</MainLayout>;
};

export default TaskPage;
