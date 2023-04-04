import FormTextarea from '@components/ui/form/form-textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import useUpdateTask from '@hooks/use-update-task';
import React from 'react';
import { Button } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCurrentTask } from 'store/kanban-store';

// TODO: maybe reuse boardTaskCreationSchema for this?
const descriptionSchema = z.object({
    taskDescription: z
        .string()
        .min(10, 'The description must contain at least 10 characters')
        .max(500, 'The description cannot contain more than 500 characters'),
});

type TaskDescription = z.infer<typeof descriptionSchema>;

const DescriptionForm = ({
    stopEdittingCb,
}: {
    stopEdittingCb: () => void;
}) => {
    const { id, title, description } = useCurrentTask()!;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskDescription>({
        resolver: zodResolver(descriptionSchema),
        values: { taskDescription: description ?? '' },
    });

    const { mutate, isLoading } = useUpdateTask(stopEdittingCb);
    const updateDescription = (description: string) =>
        mutate({ id, description });

    const onSubmit = handleSubmit(({ taskDescription }) => {
        if (description === taskDescription) {
            stopEdittingCb();
            return;
        }
        updateDescription(taskDescription);
    });

    return (
        <form onSubmit={onSubmit} className="form-control">
            <fieldset>
                <label htmlFor="description" className="label-text label">
                    Description
                </label>
                <FormTextarea<TaskDescription>
                    id="description"
                    placeholder={`description for ${title}...`}
                    className="w-full"
                    register={register}
                    registerName="taskDescription"
                    errors={errors}
                />
            </fieldset>
            <div className="mt-2 flex gap-3 self-end">
                <Button
                    type="submit"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label="Create a new task"
                >
                    {isLoading ? 'Updating...' : 'Update Description'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    onClick={stopEdittingCb}
                    aria-label="Cancel task description update"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default DescriptionForm;