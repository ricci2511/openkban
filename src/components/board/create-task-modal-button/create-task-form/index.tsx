import useCreateTask from '@hooks/use-create-task';
import React from 'react';
import ColumnSelect from './column-select';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import TaskDateInputs from './task-date-inputs';
import TaskTitleInput from './task-title-input';
import { LexoRank } from 'lexorank';
import TaskDescriptionTextarea from './task-description-textarea';
import { Form } from 'react-daisyui';
import { useAllTasks } from 'store/columns-tasks-store';

interface CreateTaskFormProps {
    createTask: ReturnType<typeof useCreateTask>['mutate'];
}
const CreateTaskForm = ({ createTask }: CreateTaskFormProps) => {
    const { handleSubmit } = useFormContext<BoardTaskCreation>();
    const storeTasks = useAllTasks();

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
            <TaskTitleInput />
            <TaskDescriptionTextarea />
            <ColumnSelect />
            <TaskDateInputs />
        </Form>
    );
};

export default CreateTaskForm;
