import { FormTextarea } from '@components/ui/form-textarea';
import { useCreateSubtask } from '@hooks/mutations/use-subtask-mutations';
import { useClickOutside } from '@hooks/use-click-outside';
import { useTitleForm } from '@hooks/use-title-form';
import { TitleInput, subtaskTitle } from '@lib/schemas/board-schemas';
import React from 'react';
import { useCurrentTask } from 'store/kanban-store';

export const CreateSubtaskForm = ({
    stopAddingCb,
}: {
    stopAddingCb: () => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useTitleForm(subtaskTitle);

    const { mutate: createSubtask, isLoading } = useCreateSubtask(stopAddingCb);
    const { id: taskId } = useCurrentTask()!;

    const onSubmit = handleSubmit(({ title }) => {
        createSubtask({ taskId, title });
    });

    const ref = useClickOutside<HTMLFormElement>(stopAddingCb);

    return (
        <form onSubmit={onSubmit} className="form-control ml-9 gap-3" ref={ref}>
            <div>
                <FormTextarea<TitleInput>
                    id="description"
                    placeholder="Your subtask title..."
                    autoFocus
                    className="w-full"
                    register={register}
                    registerName="title"
                    errors={errors}
                />
            </div>
            <div className="flex gap-2 self-start">
                <button
                    type="submit"
                    className={`btn-primary btn-sm btn ${
                        isLoading && 'loading'
                    }`}
                    disabled={isLoading}
                    aria-label="Create a new subtask"
                >
                    {isLoading ? 'Adding...' : 'Add subtask'}
                </button>
                <button
                    type="button"
                    className="btn-error btn-sm btn"
                    onClick={stopAddingCb}
                    aria-label="Cancel subtask creation"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
