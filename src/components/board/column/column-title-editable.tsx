import {
    EditableTitleInput,
    ElementTitleEditableProps,
} from '@components/editable-title-input';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { columnTitle } from '@lib/schemas/board-schemas';

export const ColumnTitleEditable = ({
    id,
    title,
    stopEditting,
}: ElementTitleEditableProps) => {
    const { mutate: updateColumn, isLoading } = useUpdateColumn();

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
            zodString={columnTitle}
            loading={isLoading}
        />
    );
};
