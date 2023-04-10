import { FormTextarea } from '@components/ui/form-textarea';
import { useUpdateSubtask } from '@hooks/mutations/use-subtask-mutations';
import { useClickOutside } from '@hooks/use-click-outside';
import { useTitleForm } from '@hooks/use-title-form';
import { TitleInput, subtaskTitle } from '@lib/schemas/board-schemas';
import React from 'react';
import { Button } from 'react-daisyui';

interface UpdateSubtaskFormProps {
    id: string;
    currTitle: string; // current subtask title
    stopEdittingCb: () => void;
}

export const UpdateSubtaskForm = ({
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

    const ref = useClickOutside<HTMLFormElement>(stopEdittingCb);

    return (
        <form
            onSubmit={onSubmit}
            className="form-control w-full gap-2"
            ref={ref}
        >
            <div>
                <FormTextarea<TitleInput>
                    id="subtask-title"
                    placeholder="Your subtask title..."
                    autoFocus
                    className="w-full"
                    register={register}
                    registerName="title"
                    errors={errors}
                />
            </div>
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
