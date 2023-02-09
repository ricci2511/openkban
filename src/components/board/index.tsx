import React, { useEffect } from 'react';
import CreateTaskModalButton from './create-task-modal-button';
import { BoardData } from 'types/board-types';
import Kanban from './kanban';
import useKanbanStore from 'store/kanban-store';

interface KanbanBoardProps {
    boardData: BoardData;
}
const KanbanBoard = ({ boardData }: KanbanBoardProps) => {
    const { id, title, columns } = boardData;
    const cols = useKanbanStore((state) => state.columns);
    const initKanbanStore = useKanbanStore((state) => state.init);

    useEffect(() => {
        const isDifferentBoard = cols.length && cols[0].boardId !== id;
        // only init store state when a different board is loaded or current store is empty
        if (isDifferentBoard || !cols.length) {
            initKanbanStore(columns);
        }
    }, [initKanbanStore, columns, cols, id]);

    return (
        <>
            <section className="fixed flex w-full items-center gap-x-6">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <CreateTaskModalButton />
            </section>
            <section className="mt-20">
                <Kanban />
            </section>
        </>
    );
};

export default KanbanBoard;
