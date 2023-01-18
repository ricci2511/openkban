import { ModalType } from '@components/ui/modal';
import useCreateTask from '@hooks/use-create-task';
import { trpc } from '@lib/trpc';
import React from 'react';
import ColumnSelect from './column-select';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { cx } from 'class-variance-authority';
import { useRouter } from 'next/router';

const CreateTaskForm = ({ toggleModal }: Pick<ModalType, 'toggleModal'>) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

    // get cached columns data with board id from current route
    const boardId = useRouter().query.bid as string;
    const columns = trpc
        .useContext()
        .boardRouter.getById.getData({ id: boardId })?.columns;

    const onCreateTaskSuccess = () => {
        toggleModal();
        reset();
    };
    const { createTask, error, isLoading } = useCreateTask(
        boardId,
        onCreateTaskSuccess
    );

    const onSubmit = handleSubmit(({ title, columnId }) => {
        createTask({ title, id: columnId });
    });

    const titleError = errors.title;

    return (
        <form className="form-control mt-2 w-full gap-2" onSubmit={onSubmit}>
            <label className="label">
                <span className="label-text" aria-required>
                    Task title
                </span>
            </label>
            <input
                type="text"
                placeholder="title"
                className={cx(
                    'input-bordered input w-full',
                    titleError && 'input-error'
                )}
                {...register('title', { required: true })}
            />
            {titleError && (
                <p className="mt-2 text-sm text-error">{titleError.message}</p>
            )}
            <ColumnSelect columns={columns} />
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
