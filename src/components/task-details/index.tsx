import React from 'react';
import { useColumns, useCurrentTask } from 'store/kanban-store';
import { RxActivityLog } from 'react-icons/rx';
import { Description } from './description';
import { Subtasks } from './subtasks';

export const TaskDetails = () => {
    const task = useCurrentTask()!;
    const columns = useColumns();

    return (
        <div className="flex flex-col gap-6">
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
