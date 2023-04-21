import {
    EditableTitleInput,
    ElementTitleEditableProps,
} from '@components/editable-title-input';
import { useUpdateBoard } from '@hooks/mutations/use-board-mutations';
import { boardTitle } from '@lib/schemas/board-schemas';

export const BoardTitleEditable = ({
    id,
    stopEditting,
    title,
}: ElementTitleEditableProps) => {
    const { mutate: updateBoard, isLoading } = useUpdateBoard();

    const updateTitle = (newTitle: string) => {
        updateBoard(
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
            zodString={boardTitle}
        />
    );
};
