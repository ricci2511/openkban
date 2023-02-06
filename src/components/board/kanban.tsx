import React, { useEffect, useState } from 'react';
import Column from './column';
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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Task from './task';
import useKanbanStore, { ColumnTasks } from 'store/kanban-store';
import DndDragOverlay from '@components/dnd/dnd-drag-overlay';
import {
    createSortablePayloadByIndex,
    getBetweenRankAsc,
} from '@lib/lexorank-helpers';
import useUpdateTask from '@hooks/use-update-task';

const Kanban = () => {
    const columns = useKanbanStore((state) => state.columnTasks);
    const setColumns = useKanbanStore((state) => state.setColumnTasks);
    const [containers, setContainers] = useState<UniqueIdentifier[] | null>(
        null
    );
    // id of the currently dragged task
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [clonedColumns, setClonedColumns] = useState<ColumnTasks | null>(
        null
    );

    const { updateTask, error } = useUpdateTask();

    useEffect(() => {
        if (!containers) {
            setContainers(Object.keys(columns));
        }
    }, [columns, containers]);

    const findContainer = (id: UniqueIdentifier) => {
        if (id in columns) {
            return id;
        }

        return Object.keys(columns).find((key) =>
            columns[key].tasks.find((task) => task.id === id)
        );
    };

    const onDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id);
        setClonedColumns(columns);
    };

    const onDragCancel = () => {
        if (clonedColumns) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setColumns(clonedColumns);
        }

        setActiveId(null);
        setClonedColumns(null);
    };

    const onDragOver = ({ active, over }: DragOverEvent) => {
        const overId = over?.id;
        if (overId === null || active.id in columns) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId!);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        const activeItems = columns[activeContainer].tasks;
        const overItems = columns[overContainer].tasks;

        const activeIndex = activeItems.findIndex(
            (task) => task.id === active.id
        );
        const overIndex = overItems.findIndex((task) => task.id === overId);

        let newIndex;
        if (overId! in columns) {
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

        setColumns({
            ...columns,
            [activeContainer]: {
                ...columns[activeContainer],
                tasks: columns[activeContainer].tasks.filter(
                    (item) => item.id !== active.id
                ),
            },
            [overContainer]: {
                ...columns[overContainer],
                tasks: [
                    ...columns[overContainer].tasks.slice(0, newIndex),
                    columns[activeContainer].tasks[activeIndex],
                    ...columns[overContainer].tasks.slice(
                        newIndex,
                        columns[overContainer].tasks.length
                    ),
                ],
            },
        });
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id in columns && over?.id) {
            setContainers((containers) => {
                if (!containers) return null;
                const activeIndex = containers.indexOf(active.id);
                const overIndex = containers.indexOf(over.id);

                return arrayMove(containers, activeIndex, overIndex);
            });
        }

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
            const activeIndex = columns[activeContainer].tasks.findIndex(
                (task) => task.id === active.id
            );
            const overIndex = columns[overContainer].tasks.findIndex(
                (task) => task.id === overId
            );

            // checks if the task is dropped on a different column
            const draggedOver = clonedColumns
                ? !clonedColumns[activeContainer].tasks.find(
                      (task) => task.id === activeId
                  )
                : false;

            // prevent task update when it is dropped in the same position
            if (activeIndex !== overIndex || draggedOver) {
                const overTasks = columns[overContainer].tasks;
                // find previous, current and next task of the dragged task
                const sortablePayload = createSortablePayloadByIndex(
                    overTasks,
                    activeIndex,
                    overIndex
                );
                // calculate new rank based on the rank of the found tasks
                const newRank = getBetweenRankAsc(sortablePayload).toString();
                const newTasks = [...overTasks];
                // replace the rank of the dragged task with the new rank
                newTasks[activeIndex] = {
                    ...newTasks[activeIndex],
                    rank: newRank,
                };

                // only update columnId if the task is dropped in a different column
                updateTask({
                    id: activeId as string,
                    rank: newRank,
                    columnId: draggedOver
                        ? (overContainer as string)
                        : undefined,
                });
                setColumns({
                    ...columns,
                    [overContainer]: {
                        ...columns[overContainer],
                        tasks: arrayMove(newTasks, activeIndex, overIndex),
                    },
                });
            }
        }

        setActiveId(null);
    };

    const renderTask = () => {
        if (!activeId) return null;
        const activeContainer = findContainer(activeId);
        if (!activeContainer) return null;
        const task = columns[activeContainer].tasks.find(
            (t) => t.id === activeId
        );
        const color = columns[activeContainer].color;
        return task ? <Task task={task} color={color} /> : null;
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
            <ul className="grid auto-cols-[minmax(225px,_1fr)] grid-flow-col items-start gap-7">
                {containers &&
                    containers.map((id) => (
                        <Column key={id} column={columns[id]} />
                    ))}
            </ul>
            <DndDragOverlay activeId={activeId} renderMethod={renderTask} />
        </DndContext>
    );
};

export default Kanban;
