import React from 'react';
import TaskDetailsModal from './task-details-modal';
import KanbanBoard from './kanban-board';

const KanbanBodySection = () => {
    return (
        <section className="h-full overflow-y-clip pt-28">
            <KanbanBoard />
            <TaskDetailsModal />
        </section>
    );
};

export default KanbanBodySection;
