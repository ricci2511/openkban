import { BoardTask } from '@prisma/client';
import { TaskWithSubTasks } from 'types/board-types';
import React from 'react';

const TaskDetails = ({ task }: { task: TaskWithSubTasks }) => {
    // TODO
    return (
        <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
    );
};

export default TaskDetails;
