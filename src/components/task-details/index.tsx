import React from 'react';
import Description from './description';
import { useColumns, useCurrentTask } from 'store/kanban-store';
import Subtasks from './subtasks';
import { RxActivityLog } from 'react-icons/rx';

const TaskDetails = () => {
    const task = useCurrentTask()!;
    const columns = useColumns();

    return (
        <div className="mx-auto flex flex-col gap-6">
            <section className="mb-2 flex items-center gap-3">
                <RxActivityLog size={22} />
                <h1 className="text-4xl font-bold">
                    {task?.title.charAt(0).toUpperCase() + task?.title.slice(1)}
                </h1>
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
