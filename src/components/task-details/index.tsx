import { BoardTask } from '@prisma/client';
import React from 'react';

const TaskDetails = ({ task }: { task: BoardTask }) => {
    // TODO
    return (
        <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
    );
};

export default TaskDetails;
