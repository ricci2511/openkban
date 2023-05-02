import { DialogHeader, DialogFooter, DialogTitle } from '@components/ui/dialog';
import { useCreateTask } from '@hooks/mutations/use-task-mutations';
import { useCanPerformEntityAction } from '@hooks/use-can-perform-entity-action';
import { CreateTaskForm } from './create-task-form';
import { Button } from '@components/ui/button';

export const CreateTaskContent = ({
    closeDialog,
}: {
    closeDialog: () => void;
}) => {
    // close dialog after successful task creation
    const { mutate: createTask, isLoading } = useCreateTask(closeDialog);
    // check if the current user has permissions to create a task
    const canCreate = useCanPerformEntityAction('TASK', 'CREATE');

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create a new Task</DialogTitle>
            </DialogHeader>
            <CreateTaskForm createTask={createTask} />
            <DialogFooter>
                <Button
                    type="submit"
                    form="create-task-form"
                    disabled={!canCreate}
                    variant="success"
                    loading={isLoading}
                    aria-label="Create a new task"
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </Button>
            </DialogFooter>
        </>
    );
};
