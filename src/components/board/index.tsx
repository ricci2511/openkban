import { Board, BoardColumn, BoardTask } from '@prisma/client';
import React from 'react';
import Column from './column';
import CreateTaskModalButton from './create-task-modal-button';

interface KanbanBoardProps {
    boardData: Board & {
        columns: (BoardColumn & {
            tasks: BoardTask[];
        })[];
    };
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
                <ul className="grid auto-cols-[minmax(225px,_1fr)] grid-flow-col items-start gap-7">
                    {columns.map((column) => (
                        <Column key={column.id} column={column} />
                    ))}
                </ul>
            </section>
        </>
    );
};

export default KanbanBoard;
