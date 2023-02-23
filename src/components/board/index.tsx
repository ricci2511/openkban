import React, { useEffect } from 'react';
import CreateTaskModalButton from './create-task-modal-button';
import { BoardData } from 'types/board-types';
import Kanban from './kanban';
import useKanbanStore from 'store/kanban-store';
import TaskDetailsModal from './task-details-modal';

interface KanbanBoardProps {
    boardData: BoardData;
}
const KanbanBoard = ({ boardData }: KanbanBoardProps) => {
    const { id, title, columns } = boardData;
    const boardId = useKanbanStore((state) => state.boardId);
    const initKanbanStore = useKanbanStore((state) => state.init);

    useEffect(() => {
        // only init store state when a different board is loaded or current store is empty
        if (boardId !== id || !boardId) {
            initKanbanStore(columns);
        }
    }, [initKanbanStore, columns, id, boardId]);

    return (
        <>
            <section className="fixed flex w-full items-center gap-x-6 p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <CreateTaskModalButton />
            </section>
            <section className="overflow-y-clip pt-28">
                <Kanban />
                <TaskDetailsModal />
            </section>
        </>
    );
};

export default KanbanBoard;
