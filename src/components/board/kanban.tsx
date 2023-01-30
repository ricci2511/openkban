import { BoardColumnWithTasks } from 'types/board-types';
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

interface KanbanProps {
    columns: BoardColumnWithTasks[];
}

const initColumnItems = (columns: BoardColumnWithTasks[]) => {
    return columns.reduce(
        (acc: { [columnId: string]: BoardColumnWithTasks }, cur) => {
            acc[cur.id] = cur;
            return acc;
        },
        {}
    );
};

type ColumnItems = ReturnType<typeof initColumnItems>;

const Kanban = ({ columns }: KanbanProps) => {
    const [columnItems, setColumnItems] = useState(initColumnItems(columns));
    const [containers, setContainers] = useState(
        Object.keys(columnItems) as UniqueIdentifier[]
    );
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [clonedColumnItems, setClonedColumnItems] =
        useState<ColumnItems | null>(null);

    useEffect(() => {
        setColumnItems(initColumnItems(columns));
    }, [columns]);

    const findContainer = (id: UniqueIdentifier) => {
        if (id in columnItems) {
            return id;
        }

        return Object.keys(columnItems).find((key) =>
            columnItems[key].tasks.find((task) => task.id === id)
        );
    };

    const onDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id);
        setClonedColumnItems(columnItems);
    };

    const onDragCancel = () => {
        if (clonedColumnItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setColumnItems(clonedColumnItems);
        }

        setActiveId(null);
        setClonedColumnItems(null);
    };

    const onDragOver = ({ active, over }: DragOverEvent) => {
        const overId = over?.id;
        if (overId === null || active.id in columnItems) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId!);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setColumnItems((items) => {
            const activeItems = items[activeContainer].tasks;
            const overItems = items[overContainer].tasks;

            // Find the indexes for the items
            const activeIndex = activeItems.findIndex(
                (task) => task.id === active.id
            );
            const overIndex = overItems.findIndex((task) => task.id === overId);

            let newIndex;
            if (overId! in items) {
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
                    overIndex >= 0
                        ? overIndex + modifier
                        : overItems.length + 1;
            }

            return {
                ...items,
                [activeContainer]: {
                    ...items[activeContainer],
                    tasks: items[activeContainer].tasks.filter(
                        (item) => item.id !== active.id
                    ),
                },
                [overContainer]: {
                    ...items[overContainer],
                    tasks: [
                        ...items[overContainer].tasks.slice(0, newIndex),
                        columnItems[activeContainer].tasks[activeIndex],
                        ...items[overContainer].tasks.slice(
                            newIndex,
                            items[overContainer].tasks.length
                        ),
                    ],
                },
            };
        });
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id in columnItems && over?.id) {
            setContainers((containers) => {
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
            const activeIndex = columnItems[activeContainer].tasks.findIndex(
                (task) => task.id === active.id
            );
            const overIndex = columnItems[overContainer].tasks.findIndex(
                (task) => task.id === overId
            );

            if (activeIndex !== overIndex) {
                setColumnItems((items) => ({
                    ...items,
                    [overContainer]: {
                        ...items[overContainer],
                        tasks: arrayMove(
                            items[overContainer].tasks,
                            activeIndex,
                            overIndex
                        ),
                    },
                }));
            }
        }

        setActiveId(null);
    };

    const renderTask = () => {
        if (!activeId) return null;
        const activeContainer = findContainer(activeId);
        if (!activeContainer) return null;
        const task = columnItems[activeContainer].tasks.find(
            (t) => t.id === activeId
        );
        const color = columnItems[activeContainer].color;
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
                {containers.map((id) => (
                    <Column key={id} column={columnItems[id]} />
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
