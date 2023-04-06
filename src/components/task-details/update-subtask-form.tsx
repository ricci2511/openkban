import FormTextarea from '@components/ui/form/form-textarea';
import { useTitleForm } from '@hooks/use-title-form';
import { useUpdateSubtask } from '@hooks/use-update-subtask';
import { TitleInput, subtaskTitle } from '@lib/schemas/board-schemas';
import React from 'react';
import { Button } from 'react-daisyui';

interface UpdateSubtaskFormProps {
    id: string;
    currTitle: string; // current subtask title
    stopEdittingCb: () => void;
}

const UpdateSubtaskForm = ({
    id,
    currTitle,
    stopEdittingCb,
}: UpdateSubtaskFormProps) => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useTitleForm(subtaskTitle, {
        values: { title: currTitle },
    });

    const { mutate: updateSubtask, isLoading } =
        useUpdateSubtask(stopEdittingCb);

    const onSubmit = handleSubmit(({ title }) => {
        if (title === currTitle) {
            stopEdittingCb();
            return;
        }
        updateSubtask({ id, title });
    });

    return (
        <form onSubmit={onSubmit} className="form-control w-full gap-2">
            <fieldset>
                <FormTextarea<TitleInput>
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
                    aria-label={`Save subtask with title: ${getValues(
                        'title'
                    )}`}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    size="sm"
                    onClick={stopEdittingCb}
                    aria-label="Cancel subtask update"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default UpdateSubtaskForm;
