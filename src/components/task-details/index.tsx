import { TaskWithSubTasks } from 'types/board-types';
import React from 'react';
import { BoardColumn } from '@prisma/client';

const TaskDetails = ({
    task,
    columns,
}: {
    task: TaskWithSubTasks;
    columns?: BoardColumn[];
}) => {
    // TODO
    return (
        <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
    );
};

export default TaskDetails;
