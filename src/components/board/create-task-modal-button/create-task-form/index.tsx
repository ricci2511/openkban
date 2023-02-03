import { ModalType } from '@components/ui/modal';
import useCreateTask from '@hooks/use-create-task';
import React from 'react';
import ColumnSelect from './column-select';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import TaskDateInputs from './task-date-inputs';
import TaskTitleInput from './task-title-input';

const CreateTaskForm = ({ toggleModal }: Pick<ModalType, 'toggleModal'>) => {
    const { handleSubmit, reset } = useFormContext<BoardTaskCreation>();

    const onCreateTaskSuccess = () => {
        toggleModal();
        reset();
    };
    const { createTask, error, isLoading } = useCreateTask(onCreateTaskSuccess);

    const onSubmit = handleSubmit(({ title, columnId, startDate, dueDate }) => {
        createTask({ title, columnId, startDate, dueDate });
    });

    return (
        <form className="form-control mt-2 w-full gap-2" onSubmit={onSubmit}>
            <TaskTitleInput />
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
