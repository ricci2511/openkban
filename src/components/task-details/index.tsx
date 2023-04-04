import React from 'react';
import Description from './description';
import { useColumns, useCurrentTask, useSubtasks } from 'store/kanban-store';

const TaskDetails = ({ taskId }: { taskId: string }) => {
    const task = useCurrentTask();
    const subtasks = useSubtasks();
    const columns = useColumns();

    return (
        <div>
            <section className="mb-4 flex gap-4">
                <h1 className="text-4xl font-bold">{task?.title}</h1>
                {/**
                 * TODO: Some sort of columns dropdown to switch the task to another column if desired.
                 * Each dropdown item being a button with the column name and color.
                 */}
            </section>
            <section>
                <Description />
            </section>
        </div>
    );
};

export default TaskDetails;
