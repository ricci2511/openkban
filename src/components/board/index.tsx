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
            <h1 className="text-2xl font-semibold uppercase">{title}</h1>
            <div
                className={`grid grid-cols-${columns.length} mt-10 grid-flow-col items-start gap-6`}
            >
                {columns.map((column) => (
                    <Column key={column.id} column={column} />
                ))}
            </div>
            <CreateTaskModalButton />
        </>
    );
};

export default KanbanBoard;
