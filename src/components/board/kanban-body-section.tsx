import React from 'react';
import { TaskDetailsModal } from './task-details-modal';
import { KanbanBoard } from './kanban-board';

export const KanbanBodySection = () => {
    return (
        <section className="relative flex-grow">
            <div className="absolute inset-0 mt-4 mb-1 select-none overflow-x-auto overflow-y-hidden pb-1">
                <KanbanBoard />
                <TaskDetailsModal />
            </div>
        </section>
    );
};
