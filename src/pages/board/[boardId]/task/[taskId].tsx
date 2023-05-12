import React, { ReactElement } from 'react';
import BoardPage from '..';
import { NextPageWithLayout } from 'pages/_app';
import { KanbanLayout } from '@components/layouts/kanban-layout';

/**
 * For task details, the route as modal pattern is used,
 * therefore the board page content is rendered and the modal
 * is automatically opened by having the taskId in the query.
 *
 * @see: src/components/board/task-details-dialog.tsx
 */
const TaskPage: NextPageWithLayout = () => {
    return <BoardPage />;
};

TaskPage.getLayout = function getLayout(page: ReactElement) {
    return <KanbanLayout>{page}</KanbanLayout>;
};

export default TaskPage;
