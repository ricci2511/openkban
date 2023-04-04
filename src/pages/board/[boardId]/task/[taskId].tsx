import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import TaskDetails from '@components/task-details';
import { NextPageWithLayout } from 'pages/_app';
import MainLayout from '@components/layouts/main-layout';
import { trpc } from '@lib/trpc';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import {
    useColumnsActions,
    useCurrentTask,
    useSubtasksActions,
    useTasksActions,
} from 'store/kanban-store';

export const TaskPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { boardId, taskId } = router.query;

    const { setCurrentTask } = useTasksActions();
    const { setColumns } = useColumnsActions();
    const { setSubtasks } = useSubtasksActions();

    const { data: columns } = trpc.boardColumnRouter.getAll.useQuery(
        {
            boardId: boardId as string,
        },
        {
            refetchOnWindowFocus: false,
            onSuccess: (columns) => {
                setColumns(columns);
            },
        }
    );

    const {
        data: task,
        error,
        status,
    } = trpc.boardTaskRouter.getById.useQuery(
        { id: taskId as string },
        {
            // task query depends on columns query
            enabled: !!columns,
            refetchOnWindowFocus: false,
            onSuccess: (task) => {
                if (!task) return;
                const { subtasks, ...taskWithoutSubtasks } = task;
                setCurrentTask(taskWithoutSubtasks);
                setSubtasks(subtasks);
            },
        }
    );

    const currentTask = useCurrentTask();

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

    if (!task || !currentTask) {
        return <NextError title="Task not found" statusCode={404} />;
    }

    return (
        <div>
            <button
                className="mb-4"
                onClick={() =>
                    router
                        .replace(`/board/${boardId}`)
                        .then(() => router.reload())
                }
            >
                {'<- BACK TO BOARD'}
            </button>
            <TaskDetails taskId={task.id} />
        </div>
    );
};

TaskPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout responsive>{page}</MainLayout>;
};

export default TaskPage;
