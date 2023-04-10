import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import Task, { TaskProps } from './task';
import { animateLayoutChanges } from '@lib/helpers';

export const TaskSortable = ({ task, color }: TaskProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ animateLayoutChanges, id: task.id });

    const style = {
        cursor: isDragging ? 'grabbing' : 'default',
        touchAction: 'none', // fixes messed up dragging on touch devices
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes}>
            <Task
                task={task}
                color={color}
                isDragging={isDragging}
                listeners={listeners}
            />
        </li>
    );
};

export default TaskSortable;
