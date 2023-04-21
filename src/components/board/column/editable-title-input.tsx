import { Input } from '@components/ui/input';
import { useUpdateColumn } from '@hooks/mutations/use-column-mutations';
import { useClickOutside } from '@hooks/use-click-outside';
import { cn } from '@lib/helpers';
import { useState } from 'react';

interface EditableTitleInputProps {
    columnId: string;
    title: string;
    stopEditting: () => void;
}

export const EditableTitleInput = ({
    columnId,
    title,
    stopEditting,
}: EditableTitleInputProps) => {
    const [value, setValue] = useState(title);
    const { mutate: updateColumn, isLoading } = useUpdateColumn();

    const handleTitleChange = () => {
        if (title === value || isLoading) {
            stopEditting();
            return;
        }

        updateColumn(
            {
                id: columnId,
                title: value,
            },
            {
                onSuccess: () => stopEditting(),
            }
        );
    };

    const inputRef = useClickOutside<HTMLInputElement>(handleTitleChange);

    return (
        <Input
            className={cn(isLoading && 'cursor-wait')}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleChange()}
            autoFocus
            onFocus={(e) => e.target.select()}
            ref={inputRef}
        />
    );
};
