import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import { LexoRank } from 'lexorank';
import { Form } from 'react-daisyui';
import { useTasks } from 'store/kanban-store';
import { CreateTaskMutation } from '@hooks/mutations/use-task-mutations';
import { FormInput } from '@components/ui/form-input';
import { FormTextarea } from '@components/ui/form-textarea';
import { ColumnSelect } from './column-select';
import { TaskDateInputs } from './task-date-inputs';

interface CreateTaskFormProps {
    createTask: CreateTaskMutation['mutate'];
}
export const CreateTaskForm = ({ createTask }: CreateTaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();

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
            });
        }
    );

    return (
        <Form id="create-task-form" onSubmit={onSubmit}>
            <div>
                <Form.Label title="Task title" htmlFor="task-title" />
                <FormInput<BoardTaskCreation>
                    id="task-title"
                    type="text"
                    placeholder="title..."
                    className="w-full"
                    register={register}
                    registerName="title"
                    registerRules={{ required: true }}
                    errors={errors}
                    autoFocus
                />
            </div>
            <div>
                <Form.Label
                    title="Task description"
                    htmlFor="task-description"
                />
                <FormTextarea<BoardTaskCreation>
                    id="task-description"
                    placeholder="description..."
                    className="w-full"
                    register={register}
                    registerName="description"
                    errors={errors}
                />
            </div>
            <div>
                <ColumnSelect />
            </div>
            <div className="flex w-full gap-3">
                <TaskDateInputs />
            </div>
        </Form>
    );
};
