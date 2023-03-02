import { ModalType } from '@components/ui/modal';
import useCreateTask from '@hooks/use-create-task';
import React from 'react';
import ColumnSelect from './column-select';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import TaskDateInputs from './task-date-inputs';
import TaskTitleInput from './task-title-input';
import useKanbanStore from 'store/kanban-store';
import { LexoRank } from 'lexorank';
import TaskDescriptionTextarea from './task-description-textarea';

const CreateTaskForm = ({ toggleModal }: Pick<ModalType, 'toggleModal'>) => {
    const { handleSubmit, reset } = useFormContext<BoardTaskCreation>();
    const columnTasks = useKanbanStore((state) => state.tasks);

    const onCreateTaskSuccess = () => {
        toggleModal();
        reset();
    };
    const { createTask, error, isLoading } = useCreateTask(onCreateTaskSuccess);

    const generateRank = (columnId: string) => {
        const tasks = columnTasks[columnId];
        const tasksLength = tasks.length;
        if (!tasksLength) {
            return LexoRank.middle().toString();
        } else {
            const lastTask = tasks[tasksLength - 1];
            return LexoRank.parse(lastTask.rank).genNext().toString();
        }
    };

    const onSubmit = handleSubmit(
        ({ title, description, columnId, startDate, dueDate }) => {
            const rank = generateRank(columnId);
            createTask({
                title,
                description,
                columnId,
                startDate,
                dueDate,
                rank,
            });
        }
    );

    return (
        <form className="form-control mt-2 w-full gap-2" onSubmit={onSubmit}>
            <TaskTitleInput />
            <TaskDescriptionTextarea />
            <ColumnSelect />
            <TaskDateInputs />
            <div className="modal-action">
                <button
                    type="submit"
                    className={cx(
                        'btn-primary btn',
                        isLoading ? 'btn-disabled loading' : null
                    )}
                    aria-label="Create a new task"
                >
                    {isLoading ? 'Adding...' : 'Add Task'}
                </button>
                <button
                    type="button"
                    className="btn-error btn"
                    onClick={toggleModal}
                    aria-label="Cancel task creation and close modal"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
