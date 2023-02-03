import React, { useEffect, useState } from 'react';
import Column from './column';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './task';
import useKanbanStore, { ColumnTasks } from 'store/kanban-store';

const Kanban = () => {
    const columns = useKanbanStore((state) => state.columnTasks);
    const setColumns = useKanbanStore((state) => state.setColumnTasks);
    const [containers, setContainers] = useState<UniqueIdentifier[] | null>(
        null
    );
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

        // Find the indexes for the items
        const activeIndex = activeItems.findIndex(
            (task) => task.id === active.id
        );
        const overIndex = overItems.findIndex((task) => task.id === overId);

        let newIndex;
        if (overId! in columns) {
            // We're at the root droppable of a container
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

            if (activeIndex !== overIndex) {
                setColumns({
                    ...columns,
                    [overContainer]: {
                        ...columns[overContainer],
                        tasks: arrayMove(
                            columns[overContainer].tasks,
                            activeIndex,
                            overIndex
                        ),
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
            {typeof window !== 'undefined'
                ? createPortal(
                      <DragOverlay>
                          {activeId ? renderTask() : null}
                      </DragOverlay>,
                      document.body
                  )
                : null}
        </DndContext>
    );
};

export default Kanban;
