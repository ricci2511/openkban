import FormInput from '@components/ui/form/form-input';
import { useCreateSubtask } from '@hooks/use-create-subtask';
import { useTitleForm } from '@hooks/use-title-form';
import { TitleInput, subtaskTitle } from '@lib/schemas/board-schemas';
import React from 'react';
import { Button } from 'react-daisyui';
import { useCurrentTask } from 'store/kanban-store';

const CreateSubtaskForm = ({ stopAddingCb }: { stopAddingCb: () => void }) => {
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

    return (
        <form onSubmit={onSubmit} className="form-control gap-3">
            <fieldset>
                <FormInput<TitleInput>
                    id="description"
                    placeholder="Your subtask title..."
                    autoFocus
                    className="w-full"
                    register={register}
                    registerName="title"
                    errors={errors}
                />
            </fieldset>
            <div className="flex gap-2 self-start">
                <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label="Create a new subtask"
                >
                    {isLoading ? 'Adding...' : 'Add subtask'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    size="sm"
                    onClick={stopAddingCb}
                    aria-label="Cancel subtask creation"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default CreateSubtaskForm;
