import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import useDeleteTask from '@hooks/use-delete-task';
import { BoardTask } from '@prisma/client';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import React from 'react';
import { HiOutlineDotsHorizontal, HiTrash } from 'react-icons/hi';
import { RxDragHandleDots2 } from 'react-icons/rx';
import Link from 'next/link';
import useKanbanStore from 'store/kanban-store';
import { Button, Dropdown } from 'react-daisyui';

export interface TaskProps {
    task: BoardTask;
    color: string;
    isDragging?: boolean;
    listeners?: SyntheticListenerMap | undefined;
}
const Task = ({ task, color, isDragging, listeners }: TaskProps) => {
    const { id, title, dueDate } = task;
    const boardId = useKanbanStore((state) => state.boardId);
    const { deleteTask, isLoading, error } = useDeleteTask();

    const taskClasses = cx(
        'flex bg-base-200 border-l-2',
        isDragging ? 'opacity-50' : null
    );

    return (
        <div className={taskClasses} style={{ borderLeftColor: color }}>
            <Link
                className="flex flex-1 py-2"
                href={`/board/[boardId]?boardId=${boardId}&taskId=${id}`}
                as={`/board/${boardId}/task/${id}`}
                scroll={false}
                shallow
            >
                <div className="flex flex-col space-y-4 p-3">
                    <span>{title}</span>
                    <span className="text-xs font-extralight">
                        {`${dayjs()
                            .month(dueDate.getMonth())
                            .format('MMM')} ${dueDate.getDate()}`}
                    </span>
                </div>
            </Link>
            <div className="flex flex-none flex-col items-center space-y-6 py-2">
                <span className="pr-1 pt-4" aria-roledescription="draggable">
                    <Button color="ghost" size="xs">
                        <RxDragHandleDots2
                            size={20}
                            className="cursor-grab focus:cursor-grabbing"
                            {...listeners}
                        />
                    </Button>
                </span>
                <span className="pr-1">
                    <Dropdown vertical="end">
                        <Button color="ghost" size="xs">
                            <HiOutlineDotsHorizontal size={18} />
                        </Button>
                        <Dropdown.Menu className="w-36">
                            <li>
                                <Button
                                    variant="outline"
                                    color="error"
                                    startIcon={<HiTrash size={18} />}
                                    aria-label={`Delete ${title} task`}
                                    loading={isLoading}
                                    onClick={() => deleteTask({ id })}
                                >
                                    Delete
                                </Button>
                            </li>
                        </Dropdown.Menu>
                    </Dropdown>
                </span>
            </div>
        </div>
    );
};

export default Task;
