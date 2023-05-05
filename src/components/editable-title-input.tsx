import { useClickOutside } from '@hooks/use-click-outside';
import { useTitleForm } from '@hooks/use-title-form';
import { z } from 'zod';
import { TitleInput } from '@lib/schemas/board-schemas';
import { FormInput } from './form-input';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

export interface ElementTitleEditableProps {
    id: string;
    title: string;
    stopEditting: () => void;
}

interface EditableTitleInputProps
    extends Omit<ElementTitleEditableProps, 'id' | 'ownerId'> {
    updater: (newTitle: string) => void;
    zodString: z.ZodString; // zod string to validate the title against
    loading?: boolean; // optional loading state to disable input
}

export const EditableTitleInput = ({
    title,
    stopEditting,
    updater,
    zodString,
    loading,
}: EditableTitleInputProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useTitleForm(zodString, {
        defaultValues: { title },
    });

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            stopEditting();
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
    };

    const onSubmit = handleSubmit(({ title: newTitle }) => {
        if (newTitle === title) {
            stopEditting();
            return;
        }
        updater(newTitle);
    });

    const ref = useClickOutside<HTMLFormElement>(onSubmit);

    return (
        <form ref={ref} className="flex flex-col gap-2" onSubmit={onSubmit}>
            <FormInput<TitleInput>
                type="text"
                name="title"
                register={register}
                rules={{ required: true }}
                errors={errors}
                disabled={loading}
                onKeyDown={onKeyDown}
                autoFocus
            >
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={loading}
                    title="Save changes"
                >
                    {!loading && <Check className="h-4 w-4" />}
                    <span className="sr-only">Save changes</span>
                </Button>
            </FormInput>
        </form>
    );
};
