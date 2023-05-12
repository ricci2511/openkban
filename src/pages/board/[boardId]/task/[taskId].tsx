import React from 'react';
import BoardPage from '..';

/**
 * For task details, the route as modal pattern is used,
 * therefore the board page content is rendered and the modal
 * is automatically opened by having the taskId in the query.
 *
 * @see: src/components/board/task-details-dialog.tsx
 */
const TaskPage = () => {
    return <BoardPage />;
};

export default TaskPage;
