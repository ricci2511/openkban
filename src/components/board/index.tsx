import { Board, BoardColumn, BoardTask } from '@prisma/client';
import React from 'react';

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
            <h1 className="text-2xl font-semibold">{title}</h1>
            {/* TESTING */}
            <div
                className={`grid grid-cols-${columns.length} mt-8 grid-flow-col justify-between`}
            >
                {columns.map((column) => (
                    <div key={column.id}>
                        <h3 className="text-lg">{column.title}</h3>
                    </div>
                ))}
            </div>
        </>
    );
};

export default KanbanBoard;
