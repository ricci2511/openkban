import { DeleteButtonWithPopover } from '@components/delete-button-with-popover';
import { useDeleteSubtask } from '@hooks/mutations/use-subtask-mutations';

interface DeleteSubtaskButtonProps {
    id: string;
    title: string;
}
export const DeleteSubtaskButton = ({
    id,
    title,
}: DeleteSubtaskButtonProps) => {
    const { mutate, isLoading } = useDeleteSubtask();

    const onDeleteSubtask = () => {
        mutate({ id });
    };

    return (
        <DeleteButtonWithPopover
            variant="outline"
            size="xs"
            loading={isLoading}
            onDelete={onDeleteSubtask}
        >
            Remove <strong>{title}</strong> subtask?
        </DeleteButtonWithPopover>
    );
};
