import React, { useEffect } from 'react';
import TaskDetailsModal from './task-details-modal';
import KanbanBoard from './kanban-board';
import { BoardColumnWithTasks } from 'types/board-types';
import { useInitKanbanStore } from 'store/kanban-store';

const KanbanBodySection = ({
    columns,
}: {
    columns: BoardColumnWithTasks[];
}) => {
    const initStore = useInitKanbanStore();

    useEffect(() => {
        initStore(columns);
    }, [initStore, columns]);

    return (
        <section className="h-full overflow-y-clip pt-28">
            <KanbanBoard />
            <TaskDetailsModal />
        </section>
    );
};

export default KanbanBodySection;
