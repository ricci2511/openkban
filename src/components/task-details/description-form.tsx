import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCurrentTask } from 'store/kanban-store';
import { useClickOutside } from '@hooks/use-click-outside';
import { useUpdateTask } from '@hooks/mutations/use-task-mutations';
import { FormTextarea } from '@components/ui/form-textarea';

// TODO: maybe reuse boardTaskCreationSchema for this?
const descriptionSchema = z.object({
    taskDescription: z
        .string()
        .min(10, 'The description must contain at least 10 characters')
        .max(500, 'The description cannot contain more than 500 characters'),
});

type TaskDescription = z.infer<typeof descriptionSchema>;

export const DescriptionForm = ({
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
            <div>
                <FormTextarea<TaskDescription>
                    id="description"
                    placeholder={`description for ${title}...`}
                    autoFocus
                    className="w-full"
                    register={register}
                    registerName="taskDescription"
                    errors={errors}
                />
            </div>
            <div className="mt-2 flex gap-3 self-start">
                <button
                    type="submit"
                    className={`btn-primary btn-sm btn ${
                        isLoading && 'loading'
                    }`}
                    disabled={isLoading}
                    aria-label={`Update description for task ${title}`}
                >
                    {isLoading ? 'Updating...' : 'Update Description'}
                </button>
                <button
                    type="button"
                    className="btn-error btn-sm btn"
                    onClick={stopEdittingCb}
                    aria-label="Cancel task description update"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
