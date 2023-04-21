import { EditableTitleInput } from '@components/editable-title-input';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { columnTitle } from '@lib/schemas/board-schemas';

interface ColumnTitleEditableProps {
    id: string;
    title: string;
    stopEditting: () => void;
}

export const ColumnTitleEditable = ({
    id,
    title,
    stopEditting,
}: ColumnTitleEditableProps) => {
    const { mutate: updateColumn, isLoading } = useUpdateColumn();
    console.log('ColumnTitleEditable');

    const updateTitle = (newTitle: string) => {
        updateColumn(
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
            zodString={columnTitle}
        />
    );
};
