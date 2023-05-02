import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardTask } from '@prisma/client';
import { useMemo } from 'react';
import { TaskSortable } from './task-sortable';
import { useMyRole } from 'store/kanban-store';
import { Task } from './task';

interface TasksListProps {
    columnId: string;
    tasks: BoardTask[];
}

export const TasksList = ({ columnId, tasks }: TasksListProps) => {
    // each column is a droppable area for tasks
    const { setNodeRef } = useDroppable({
        id: columnId,
    });

    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    // viewer's can't drag tasks
    const myRole = useMyRole();

    return (
        <SortableContext
            id={columnId}
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            {/* Might add a custom scrollbar for consistency between os's */}
            <ul
                ref={setNodeRef}
                className="flex h-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-scroll rounded-md bg-muted p-2"
            >
                {myRole === 'VIEWER'
                    ? tasks.map((task) => (
                          <li key={task.id}>
                              <Task task={task} />
                          </li>
                      ))
                    : tasks.map((task) => (
                          <TaskSortable key={task.id} task={task} />
                      ))}
            </ul>
        </SortableContext>
    );
};
