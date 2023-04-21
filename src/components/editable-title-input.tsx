import { Input } from '@components/ui/input';
import { useClickOutside } from '@hooks/use-click-outside';
import { cn } from '@lib/helpers';
import { useState } from 'react';
import { z } from 'zod';

interface EditableTitleInputProps {
    title: string;
    stopEditting: () => void;
    updater: (newTitle: string) => void;
    loading?: boolean; // optional loading state to disable input
    zodString?: z.ZodString; // optional zod string to validate the title against
}

export const EditableTitleInput = ({
    title,
    stopEditting,
    updater,
    loading,
    zodString,
}: EditableTitleInputProps) => {
    const [value, setValue] = useState(title);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            handleTitleChange();
        }
    };

    const handleTitleChange = () => {
        if (title === value || !value) {
            stopEditting();
            return;
        }

        // validate title before updating if zodString is provided
        if (!zodString?.safeParse(value).success) return;

        updater(value);
    };

    const inputRef = useClickOutside<HTMLInputElement>(handleTitleChange);

    return (
        <Input
            className={cn(loading && 'cursor-wait')}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            autoFocus
            onFocus={(e) => e.target.select()}
            ref={inputRef}
        />
    );
};
