import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    BoardTaskCreation,
    boardTaskCreationSchema,
} from '@lib/schemas/board-schemas';
import { LexoRank } from 'lexorank';
import { useTasks, useMyRole } from 'store/kanban-store';
import { CreateTaskMutation } from '@hooks/mutations/use-task-mutations';
import { ColumnSelect } from './column-select';
import { TaskDateInputs } from './task-date-inputs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@components/ui/label';
import { FormInput } from '@components/form-input';
import { FormTextarea } from '@components/form-textarea';
import { addDays } from 'date-fns';

interface CreateTaskFormProps {
    createTask: CreateTaskMutation['mutate'];
}
export const CreateTaskForm = ({ createTask }: CreateTaskFormProps) => {
    const formMethods = useForm<BoardTaskCreation>({
        resolver: zodResolver(boardTaskCreationSchema),
        defaultValues: {
            startDate: new Date(),
            dueDate: addDays(new Date(), 5),
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = formMethods;

    const storeTasks = useTasks();
    const generateRank = (columnId: string) => {
        const tasks = storeTasks[columnId];
        const tasksLength = tasks.length;
        if (!tasksLength) {
            return LexoRank.middle().toString();
        } else {
            const lastTask = tasks[tasksLength - 1];
            return LexoRank.parse(lastTask.rank).genNext().toString();
        }
    };

    const role = useMyRole();
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
                role,
            });
        }
    );

    return (
        <FormProvider {...formMethods}>
            <form
                role="form"
                id="create-task-form"
                className="flex flex-col gap-2.5"
                onSubmit={onSubmit}
            >
                <div className="flex flex-col gap-1">
                    <Label htmlFor="task-title">Title</Label>
                    <FormInput<BoardTaskCreation>
                        id="task-title"
                        type="text"
                        placeholder="title..."
                        register={register}
                        name="title"
                        rules={{ required: true }}
                        errors={errors}
                        autoFocus
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="task-description">Description</Label>
                    <FormTextarea<BoardTaskCreation>
                        id="task-description"
                        placeholder="description..."
                        className="w-full"
                        register={register}
                        name="description"
                        errors={errors}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <ColumnSelect />
                </div>
                <div className="flex w-full gap-3">
                    <TaskDateInputs />
                </div>
            </form>
        </FormProvider>
    );
};
