import NextError from 'next/error';
import React from 'react';
import TaskDetailsModal from './task-details-modal';
import useFetchColumnTasks from '@hooks/use-fetch-column-tasks';
import CustomLoadingSpinner from '@components/ui/other/custom-loading-spinner';
import KanbanBoard from './kanban-board';

const KanbanBodySection = ({ boardId }: { boardId: string }) => {
    const { columns, tasks, error, isLoading } = useFetchColumnTasks(boardId);

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

    if (!columns || !tasks) {
        return (
            <NextError
                title="Columns and/or tasks not found"
                statusCode={404}
            />
        );
    }

    return (
        <section className="h-full overflow-y-clip pt-28">
            <KanbanBoard columns={columns} tasks={tasks} />
            <TaskDetailsModal />
        </section>
    );
};

export default KanbanBodySection;
