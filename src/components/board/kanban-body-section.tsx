import React from 'react';
import KanbanBoard from './kanban-board';
import { TaskDetailsModal } from './task-details-modal';

const KanbanBodySection = () => {
    return (
        <section className="h-full overflow-y-clip pt-28">
            <KanbanBoard />
            <TaskDetailsModal />
        </section>
    );
};

export default KanbanBodySection;
