import React, { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
    createSortablePayloadByIndex,
    getBetweenRankAsc,
} from '@lib/lexorank-helpers';
import { trpc } from '@lib/trpc';
import { MAX_COLUMNS } from '@lib/constants';
import { useColumns, useTasks, useTasksActions } from 'store/kanban-store';
import { TasksMap } from 'types/board-types';
import { DndDragOverlay } from '@components/dnd-drag-overlay';
import { CreateColumnButton } from './column-creation/create-column-button';
import { Column } from './column';
import { Task } from './task';
import { TasksList } from './tasks-list';

export const KanbanBoard = () => {
    const columns = useColumns();
    const tasks = useTasks();
    const { setTasks, dropTaskInColumn } = useTasksActions();
    // id of the currently dragged task
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [clonedTasks, setClonedTasks] = useState<TasksMap | null>(null);

    const { mutate: updateTask } = trpc.boardTaskRouter.update.useMutation({
        onError: () => {
            // reset tasks to their previous state if the mutation fails
            clonedTasks && setTasks(clonedTasks);
        },
    });

    const findContainer = (id: UniqueIdentifier) => {
        if (id in tasks) {
            return id;
        }

        return Object.keys(tasks).find((key) =>
            tasks[key].find((task) => task.id === id)
        );
    };

    const onDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id);
        setClonedTasks(tasks);
    };

    const onDragCancel = () => {
        if (clonedTasks) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setTasks(clonedTasks);
        }

        setActiveId(null);
        setClonedTasks(null);
    };

    const onDragOver = ({ active, over }: DragOverEvent) => {
        const overId = over?.id;
        if (overId === null || active.id in tasks) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId!);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        const activeItems = tasks[activeContainer];
        const overItems = tasks[overContainer];

        const activeIndex = activeItems.findIndex(
            (task) => task.id === active.id
        );
        const overIndex = overItems.findIndex((task) => task.id === overId);

        let newIndex;
        if (overId! in tasks) {
            // we're at the root droppable of a container
            newIndex = overItems.length + 1;
        } else {
            const isBelowLastItem =
                over &&
                active.rect.current.translated &&
                overIndex === overItems.length - 1 &&
                active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

            const modifier = isBelowLastItem ? 1 : 0;

            newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        // TODO: move this to its own tasks action
        setTasks({
            ...tasks,
            [activeContainer]: tasks[activeContainer].filter(
                (item) => item.id !== active.id
            ),
            [overContainer]: [
                ...tasks[overContainer].slice(0, newIndex),
                tasks[activeContainer][activeIndex],
                ...tasks[overContainer].slice(
                    newIndex,
                    tasks[overContainer].length
                ),
            ],
        });
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveId(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
            const activeIndex = tasks[activeContainer].findIndex(
                (task) => task.id === active.id
            );
            const overIndex = tasks[overContainer].findIndex(
                (task) => task.id === overId || task.columnId === overId
            );

            // checks if the task is dropped on a different column
            const draggedOver = clonedTasks
                ? !clonedTasks[activeContainer].find(
                      (task) => task.id === activeId
                  )
                : false;

            // prevent task update when it is dropped in the same position
            if (activeIndex !== overIndex || draggedOver) {
                const overTasks = tasks[overContainer];
                // find previous, current and next task of the dragged task
                const sortablePayload = createSortablePayloadByIndex(
                    overTasks,
                    activeIndex,
                    overIndex
                );
                // calculate new rank based on the rank of the found tasks
                const newRank = getBetweenRankAsc(sortablePayload).toString();
                // if the task is dropped in a different column, a new columnId is set
                const newColumnId = draggedOver
                    ? (overContainer as string)
                    : undefined;

                // update task api call
                updateTask({
                    id: activeId as string,
                    rank: newRank,
                    columnId: newColumnId,
                });

                const newTasks = [...overTasks];
                newTasks[activeIndex] = {
                    ...newTasks[activeIndex],
                    // replace the rank of the dragged task with the new rank
                    rank: newRank,
                    // if a new columnId is set, also replace the columnId of the dragged task
                    ...(newColumnId && { columnId: newColumnId }),
                };

                // update tasks in the store with the new tasks array
                dropTaskInColumn(
                    overContainer as string,
                    newTasks,
                    activeIndex,
                    overIndex
                );
            }
        }

        setActiveId(null);
    };

    const renderTask = () => {
        if (!activeId) return null;
        const activeContainer = findContainer(activeId);
        if (!activeContainer) return null;
        const task = tasks[activeContainer].find((t) => t.id === activeId);
        return task ? <Task task={task} /> : null;
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragCancel={onDragCancel}
        >
            <ul className="grid h-full auto-cols-[minmax(285px,_1fr)] grid-flow-col gap-4 pl-4 after:w-px sm:pl-6 lg:pl-8">
                {columns.map((column) => (
                    <li
                        key={column.id}
                        className="relative mt-1 flex h-[calc(100vh-225px)] flex-col gap-4"
                    >
                        <Column column={column} />
                        <TasksList
                            columnId={column.id}
                            tasks={tasks[column.id]}
                        />
                    </li>
                ))}
                {columns.length < MAX_COLUMNS && <CreateColumnButton />}
            </ul>
            <DndDragOverlay activeId={activeId} renderMethod={renderTask} />
        </DndContext>
    );
};
