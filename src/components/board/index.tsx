import React from 'react';
import Column from './column';
import CreateTaskModalButton from './create-task-modal-button';
import { BoardData } from 'types/board-types';
import Kanban from './kanban';

interface KanbanBoardProps {
    boardData: BoardData;
}
const KanbanBoard = ({ boardData }: KanbanBoardProps) => {
    const { title, columns } = boardData;
    return (
        <>
            <section className="fixed flex w-full items-center gap-x-6">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <CreateTaskModalButton />
            </section>
            <section className="mt-20">
                <Kanban columns={columns} />
            </section>
        </>
    );
};

export default KanbanBoard;
