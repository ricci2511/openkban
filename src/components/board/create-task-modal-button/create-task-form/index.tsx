import useCreateTask from '@hooks/use-create-task';
import React from 'react';
import ColumnSelect from './column-select';
import { useFormContext } from 'react-hook-form';
import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import TaskDateInputs from './task-date-inputs';
import TaskTitleInput from './task-title-input';
import useKanbanStore from 'store/kanban-store';
import { LexoRank } from 'lexorank';
import TaskDescriptionTextarea from './task-description-textarea';
import { Form } from 'react-daisyui';

interface CreateTaskFormProps {
    createTask: ReturnType<typeof useCreateTask>['createTask'];
}
const CreateTaskForm = ({ createTask }: CreateTaskFormProps) => {
    const { handleSubmit } = useFormContext<BoardTaskCreation>();
    const columnTasks = useKanbanStore((state) => state.tasks);

    const generateRank = (columnId: string) => {
        const tasks = columnTasks[columnId];
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
