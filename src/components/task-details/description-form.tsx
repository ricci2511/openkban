import FormTextarea from '@components/ui/form/form-textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import useUpdateTask from '@hooks/use-update-task';
import React from 'react';
import { Button } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCurrentTask } from 'store/kanban-store';
import { useClickOutside } from '@hooks/use-click-outside';

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

    const ref = useClickOutside<HTMLFormElement>(stopEdittingCb);

    return (
        <form onSubmit={onSubmit} className="form-control" ref={ref}>
            <fieldset>
                <FormTextarea<TaskDescription>
                    id="description"
                    placeholder={`description for ${title}...`}
                    autoFocus
                    className="w-full"
                    register={register}
                    registerName="taskDescription"
                    errors={errors}
                />
            </fieldset>
            <div className="mt-2 flex gap-3 self-start">
                <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label={`Update description for task ${title}`}
                >
                    {isLoading ? 'Updating...' : 'Update Description'}
                </Button>
                <Button
                    type="button"
                    color="error"
                    size="sm"
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
