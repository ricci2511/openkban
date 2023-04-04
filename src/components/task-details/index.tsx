import React from 'react';
import Description from './description';
import { useColumns, useCurrentTask } from 'store/kanban-store';
import Subtasks from './subtasks';

const TaskDetails = () => {
    const task = useCurrentTask();
    const columns = useColumns();

    return (
        <div className="flex flex-col gap-6">
            <section className="flex gap-4">
                <h1 className="text-4xl font-bold">{task?.title}</h1>
                {/**
                 * TODO: Some sort of columns dropdown to switch the task to another column if desired.
                 * Each dropdown item being a button with the column name and color.
                 */}
            </section>
            <section>
                <Description />
            </section>
            <section>
                <Subtasks />
            </section>
        </div>
    );
};

export default TaskDetails;
