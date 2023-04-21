import {
    EditableTitleInput,
    ElementTitleEditableProps,
} from '@components/editable-title-input';
import { useUpdateTask } from '@hooks/mutations/use-task-mutations';
import { taskTitle } from '@lib/schemas/board-schemas';

export const TaskTitleEditable = ({
    id,
    title,
    stopEditting,
}: ElementTitleEditableProps) => {
    const { mutate: updateTask, isLoading } = useUpdateTask();

    const updateTitle = (newTitle: string) => {
        updateTask(
            {
                id,
                title: newTitle,
            },
            {
                onSuccess: () => stopEditting(),
            }
        );
    };

    return (
        <EditableTitleInput
            title={title}
            stopEditting={stopEditting}
            updater={updateTitle}
            loading={isLoading}
            zodString={taskTitle}
        />
    );
};
